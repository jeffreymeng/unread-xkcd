import {
  getReadComics,
  addReadComics,
  parseUrl,
  comicsFromArray,
} from "../modules/util.js";

const buttons = new Map([
  [
    "Load Browser History",
    async () => {
      const permission = await new Promise((resolve) => {
        chrome.permissions.request(
          {
            permissions: ["history"],
          },
          resolve
        );
      });
      if (!permission) return alert("Failed to load history.");
      const candidatePages = await new Promise((resolve) => {
        chrome.history.search({ text: "xkcd" }, resolve);
      });
      chrome.permissions.remove({
        permissions: ["history"],
      });
      const comics = comicsFromArray(
        candidatePages.map(({ url }) => parseUrl(url)).filter((v) => v)
      );
      await addReadComics(comics);
      alert("History loaded.");
    },
  ],
  [
    "Export Data",
    async () => {
      const comics = await getReadComics();
      document.querySelector("textarea").value = comics.toString();
    },
  ],
  [
    "Import Data",
    async () => {
      const textarea = document.querySelector("textarea");
      const data = textarea.value;
      try {
        await addReadComics(data);
        textarea.value = "";
        alert("Data loaded.");
      } catch {
        return alert("Invalid data.");
      }
    },
  ],
  [
    "Clear Data",
    async () => {
      const confirmation = document.querySelector("input").value;
      if (confirmation !== "Permanently Clear Data")
        return alert('Please type "Permanently Clear Data" to confirm.');
      await new Promise((resolve) => {
        chrome.storage.sync.set(
          {
            readComics: "0",
          },
          resolve
        );
      });
      alert("Data cleared.");
    },
  ],
]);

(async () => {
  await new Promise((resolve) => {
    window.addEventListener("load", resolve);
  });

  for (const button of document.querySelectorAll("button")) {
    button.addEventListener("click", buttons.get(button.textContent));
  }
})();

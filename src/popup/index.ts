import {
  getReadComics,
  addReadComics,
  parseUrl,
  comicsFromArray,
  $,
} from "../modules/util";
const attachEventListeners = () => {
  $("#load-history-btn").click(async () => {
    const permission = await new Promise((resolve) => {
      chrome.permissions.request(
        {
          permissions: ["history"],
        },
        resolve
      );
    });
    if (!permission) return alert("Failed to load history.");
    const candidatePages = await new Promise<chrome.history.HistoryItem[]>(
      (resolve) => {
        chrome.history.search({
          text: "xkcd",
          maxResults: 2147483647,
          startTime: 0
        }, resolve);
      }
    );
    chrome.permissions.remove({
      permissions: ["history"],
    });
    const comics = comicsFromArray(
      candidatePages.map(({ url }) => parseUrl(url ?? "")).filter((v) => v)
    );
    await addReadComics(comics);
    alert("History loaded.");
  });
  $("#export-data-btn").click(async () => {
    const comics = await getReadComics();
    $("#import-data-textarea").val(comics.toString());
  });
  $("#import-data-btn").click(async () => {
    const textarea = $("#import-data-textarea");
    const data = textarea.val();
    try {
      await addReadComics(data);
      textarea.val("");
      alert("Data loaded.");
    } catch {
      return alert("Invalid data.");
    }
  });
  $("#clear-data-btn").click(async () => {
    const confirmation = $("#clear-data-input").val();
    if (confirmation !== "Permanently Clear Data")
      return alert('Please type "Permanently Clear Data" to confirm.');
    await new Promise<void>((resolve) => {
      chrome.storage.sync.set(
        {
          readComics: "0",
        },
        resolve
      );
    });
    alert("All data stored by this extension has been cleared.");
  });
};
(async () => {
  await new Promise((resolve) => {
    window.addEventListener("load", resolve);
  });

  attachEventListeners();
})();

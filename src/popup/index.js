"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../modules/util");
const attachEventListeners = () => {
    util_1.$("#load-history-btn").click(async () => {
        const permission = await new Promise((resolve) => {
            chrome.permissions.request({
                permissions: ["history"],
            }, resolve);
        });
        if (!permission)
            return alert("Failed to load history.");
        const candidatePages = await new Promise((resolve) => {
            chrome.history.search({ text: "xkcd" }, resolve);
        });
        chrome.permissions.remove({
            permissions: ["history"],
        });
        const comics = util_1.comicsFromArray(candidatePages.map(({ url }) => util_1.parseUrl(url ?? "")).filter((v) => v));
        await util_1.addReadComics(comics);
        alert("History loaded.");
    });
    util_1.$("#export-data-btn").click(async () => {
        const comics = await util_1.getReadComics();
        util_1.$("#import-data-textarea").val(comics.toString());
    });
    util_1.$("#import-data-btn").click(async () => {
        const textarea = util_1.$("#import-data-textarea");
        const data = textarea.val();
        try {
            await util_1.addReadComics(data);
            textarea.val("");
            alert("Data loaded.");
        }
        catch {
            return alert("Invalid data.");
        }
    });
    util_1.$("#clear-data-btn").click(async () => {
        const confirmation = util_1.$("#clear-data-input").val();
        if (confirmation !== "Permanently Clear Data")
            return alert('Please type "Permanently Clear Data" to confirm.');
        await new Promise((resolve) => {
            chrome.storage.sync.set({
                readComics: "0",
            }, resolve);
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

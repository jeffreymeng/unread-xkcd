"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./modules/util");
const getRandomComic = (min, max, visited) => {
    // generate an array with all unread comics
    const unread = Array(max - min + 1)
        .fill(0)
        .map((v, i) => i + min)
        .filter((v) => !util_1.hasId(visited, v));
    // pick a random comic
    // | 0 truncates
    return unread[(unread.length * Math.random()) | 0];
};
const insertButtons = (text) => {
    const links = [];
    for (const nav of document.querySelectorAll(".comicNav")) {
        // each nav needs an anchor with the right text
        const a = document.createElement("a");
        a.innerText = text;
        links.push(a);
        // the anchor needs to be wrapped in an li
        const li = document.createElement("li");
        li.appendChild(a);
        // stick it into the dom before the next button
        const next = nav.querySelector("li:nth-child(4)");
        nav.insertBefore(li, next);
    }
    return links;
};
/**
 * @returns {number}
 */
const getLatestComicId = async () => {
    const response = await fetch("https://xkcd.com/info.0.json");
    const data = await response.json();
    return data.num;
};
(async () => {
    const links = insertButtons("Random Unread");
    const id = getRandomComic(1, await getLatestComicId(), await util_1.getReadComics());
    for (const link of links) {
        if (id === undefined) {
            link.href = "";
            link.innerText = "No Unread Comics";
            continue;
        }
        link.href = `/${id}/`;
    }
})();

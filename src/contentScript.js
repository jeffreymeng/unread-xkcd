import {
  addId,
  hasId,
  getReadComics,
  addReadComic,
  parseUrl,
} from "./modules/util.ts";

/**
 *
 * @returns {Promise<void>}
 */
const markPageAsVisited = () => {
  const id = parseUrl(window.location.href);
  if (isNaN(id)) return;
  return addReadComic(id);
};
markPageAsVisited();

/**
 *
 * @param min {number}
 * @param max {number}
 * @param visited {Set<number>}
 * @returns {number}
 */
const getRandomComic = (min, max, visited) => {
  // generate an array with all unread comics
  const unread = Array(max - min + 1)
    .fill(0)
    .map((v, i) => i + min)
    .filter((v) => !hasId(visited, v));
  // pick a random comic
  // | 0 truncates
  return unread[(unread.length * Math.random()) | 0];
};

/**
 *
 * @param text {string} - the name of the button
 * @returns {HTMLAnchorElement[]}
 */
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
  const id = getRandomComic(1, await getLatestComicId(), await getReadComics());
  for (const link of links) {
    if (id === undefined) {
      link.href = "";
      link.innerText = "No Unread Comics";
      continue;
    }
    link.href = `/${id}/`;
  }
})();

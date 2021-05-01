/**
 *
 * @returns {Promise<Set<number>>}
 */
const getReadComics = async () => {
  return new Promise((res) => {
    chrome.storage.sync.get(["readComics"], ({ readComics }) => {
      res(new Set(readComics || []));
    });
  });
};

/**
 *
 * @param readComics {Set<number>} - set of numbers
 */
const setReadComics = async (readComics) => {
  return new Promise((res) => {
    chrome.storage.sync.set({ readComics: Array.from(readComics) }, () =>
      res()
    );
  });
};

/**
 *
 * @returns {Promise<void>}
 */
const markPageAsVisited = async () => {
  const currentId = parseInt(window.location.href.split("/")[3], 10);
  await setReadComics((await getReadComics()).add(currentId));
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
    .filter((v) => !visited.has(v));
  // pick a random comic
  // | 0 truncates
  return unread[(unread.length * Math.random()) | 0];
};

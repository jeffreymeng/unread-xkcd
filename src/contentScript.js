const getReadComics = async () => {
  return new Promise((res) => {
    chrome.storage.local.get(["readComics"], function (result) {
      res(new Set(result));
    });
  });
};

/**
 * @param readComics - set of numbers
 */
const setReadComics = async (readComics) => {
  return new Promise((res) => {
    chrome.storage.local.set({ readComics: Array.from(readComics) }, res());
  });
};

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

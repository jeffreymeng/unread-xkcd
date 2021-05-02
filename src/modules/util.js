export const addId = (n, id) => {
  return n + (1n << BigInt(id));
};

export const hasId = (n, id) => {
  return ((n >> BigInt(id)) & 1n) !== 0n;
};

export const comicsFromArray = (array) => {
  return array.reduce((n, v) => n | (1n << BigInt(v)), 0n);
};

export const getReadComics = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      ['readComics'],
      ({ readComics }) => resolve(BigInt(readComics))
    );
  });
};

export const setReadComics = (readComics) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({
      readComics: readComics.toString()
    }, resolve);
  });
};

export const addReadComics = async (comics) => {
  const readComics = await getReadComics() | BigInt(comics);
  return setReadComics(readComics);
};

export const addReadComic = async (id) => {
  return addReadComics(1n << BigInt(id));
};

export const parseUrl = (url) => {
  const { host, pathname } = new URL(url);
  if (host !== 'xkcd.com') return NaN;
  if (!pathname.match(/^\/\d+\/$/)) return NaN;
  return parseInt(pathname.match(/\d+/)[0], 10);
};

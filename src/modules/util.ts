/**
 * Mark id as read in the read comics bigint
 * @param readComics
 * @param id
 */
export const addId = (readComics: bigint, id: number): bigint => {
  return readComics + (1n << BigInt(id));
};

/**
 * Determine if id has been read in the read comics bigint
 * @param readComics
 * @param id
 */
export const hasId = (readComics: bigint, id: number): boolean => {
  return ((readComics >> BigInt(id)) & 1n) !== 0n;
};

export const comicsFromArray = (array: number[]) => {
  return array.reduce((n, v) => n | (1n << BigInt(v)), 0n);
};

export const getReadComics = (): Promise<bigint> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["readComics"], ({ readComics }) =>
      resolve(BigInt(readComics))
    );
  });
};

export const setReadComics = (readComics: bigint): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(
      {
        readComics: readComics.toString(),
      },
      resolve
    );
  });
};

export const addReadComics = async (comics: bigint | number): Promise<void> => {
  const readComics = (await getReadComics()) | BigInt(comics);
  return setReadComics(readComics);
};

export const addReadComic = async (id: number): Promise<void> => {
  return addReadComics(1n << BigInt(id));
};

export const parseUrl = (url: string): number => {
  const { host, pathname } = new URL(url);
  if (host !== "xkcd.com") return NaN;
  const matches = pathname.match(/^\/(\d+)\/$/);
  if (!matches) return NaN;
  return parseInt(matches[0], 10);
};

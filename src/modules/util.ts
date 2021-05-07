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
      resolve(BigInt(readComics ?? 0))
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

export const addReadComics = async (
  comics: number | string | bigint
): Promise<void> => {
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
  return parseInt(matches[1], 10);
};
interface ValueUtility {
  (): string;
  (value: string): void;
}
export interface ElementWithUtilities extends Element {
  on: (event: string, handler: () => void) => void;
  click: (handler: () => void) => void;
  val: ValueUtility;
}
export const $ = (selector: string) => {
  const wrapper = document.querySelector(selector) as ElementWithUtilities;
  if (!wrapper) {
    throw new Error("Element not found");
  }
  wrapper.on = (event: string, handler: () => void) => {
    wrapper.addEventListener(event, handler);
  };
  wrapper.click = (handler: () => void) => {
    wrapper.on("click", handler);
  };

  wrapper.val = ((value?: string): string | void => {
    if (!value) {
      return (wrapper as (HTMLInputElement | HTMLTextAreaElement) &
        ElementWithUtilities).value;
    }
    (wrapper as (HTMLInputElement | HTMLTextAreaElement) &
      ElementWithUtilities).value = value;
  }) as ValueUtility;

  return wrapper;
};

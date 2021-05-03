"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ = exports.parseUrl = exports.addReadComic = exports.addReadComics = exports.setReadComics = exports.getReadComics = exports.comicsFromArray = exports.hasId = exports.addId = void 0;
/**
 * Mark id as read in the read comics bigint
 * @param readComics
 * @param id
 */
const addId = (readComics, id) => {
    return readComics + (1n << BigInt(id));
};
exports.addId = addId;
/**
 * Determine if id has been read in the read comics bigint
 * @param readComics
 * @param id
 */
const hasId = (readComics, id) => {
    return ((readComics >> BigInt(id)) & 1n) !== 0n;
};
exports.hasId = hasId;
const comicsFromArray = (array) => {
    return array.reduce((n, v) => n | (1n << BigInt(v)), 0n);
};
exports.comicsFromArray = comicsFromArray;
const getReadComics = () => {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["readComics"], ({ readComics }) => resolve(BigInt(readComics)));
    });
};
exports.getReadComics = getReadComics;
const setReadComics = (readComics) => {
    return new Promise((resolve) => {
        chrome.storage.sync.set({
            readComics: readComics.toString(),
        }, resolve);
    });
};
exports.setReadComics = setReadComics;
const addReadComics = async (comics) => {
    const readComics = (await exports.getReadComics()) | BigInt(comics);
    return exports.setReadComics(readComics);
};
exports.addReadComics = addReadComics;
const addReadComic = async (id) => {
    return exports.addReadComics(1n << BigInt(id));
};
exports.addReadComic = addReadComic;
const parseUrl = (url) => {
    const { host, pathname } = new URL(url);
    if (host !== "xkcd.com")
        return NaN;
    const matches = pathname.match(/^\/(\d+)\/$/);
    if (!matches)
        return NaN;
    return parseInt(matches[0], 10);
};
exports.parseUrl = parseUrl;
const $ = (selector) => {
    const wrapper = document.querySelector(selector);
    if (!wrapper) {
        throw new Error("Element not found");
    }
    wrapper.on = (event, handler) => {
        wrapper.addEventListener(event, handler);
    };
    wrapper.click = (handler) => {
        wrapper.on("click", handler);
    };
    wrapper.val = ((value) => {
        if (!value) {
            return wrapper.value;
        }
        wrapper.value = value;
    });
    return wrapper;
};
exports.$ = $;

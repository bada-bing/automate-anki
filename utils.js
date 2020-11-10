var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require("fs");
const promisify = require("util").promisify;
const readFile = promisify(fs.readFile);

//var crypto = require("crypto");
//const hashUpdate = (content) => crypto.createHash("md5").update(content, "utf8").digest("base64");


function invoke(action, version, params = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', (e) => {reject('failed to issue request')});
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });

        xhr.open('POST', 'http://127.0.0.1:8765');
        xhr.send(JSON.stringify({ action, version, params }));
    });
}

const dictccUrl = (term) => `https://www.dict.cc/?s=${term}`;
const lingueeUrl = (term) =>
  `https://www.linguee.com/english-german/search?source=auto&query=${term}`;

function createUrls(term) {
    return {
      dictcc: dictccUrl(term),
      linguee: lingueeUrl(term),
    };
} 

function createAnchors(term) {
    const auxiliaryUrls = createUrls(term);

    return `
        <a href=${auxiliaryUrls.dictcc}>dict.cc</a>
        <a href=${auxiliaryUrls.linguee}>linguee</a>
    `;
}

module.exports = {
    invoke,
    readFile,
    createAnchors,
    createUrls,
};
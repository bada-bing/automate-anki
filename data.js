const utils = require("./utils.js");

async function loadNewWords(filename = "data/words.csv") {
  const lines = (await utils.readFile("data/words.csv", { encoding: "utf8" }))
    .toString(filename)
    .split("\n");

  const words = [];
  lines.forEach((line) => {
    const [primaryWord, ...rest] = line.split(",");
    words.push([primaryWord, rest.join(", ").trim()]);
  });
  return words;
}

module.exports = {
    loadNewWords
};
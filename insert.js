// module responsible for insertion of new cards (and potentially decks)

const utils = require("./utils.js");
const invoke = utils.invoke;

const action = "addNote";
const version = 6;


function insertCard(newNote){
  const { primaryWord, description } = newNote;
  const anchors = utils.createAnchors(primaryWord);

  const note = {
      deckName: "test_1",
      modelName: "Basic",
      fields: {
        Front: primaryWord,
        Back: description + "<br />" + anchors,
      },
      options: {
        allowDuplicate: false,
        duplicateScope: "deck",
      },
      tags: ["0"],
    };

    const params = {
      note,
    };
    try {
      return invoke(action, version, params);
    } catch(e){
      console.log("we have a problem", e);
    }
}


async function insertNewCards(notes) {
  
    const promises = [];
    const newNotes = JSON.parse(JSON.stringify(notes));
    notes.forEach((note) => {
      promises.push(insertCard(note));
    });

    const results = await Promise.allSettled(promises);
    results.forEach((result, idx) => {
      newNotes[idx].newCardStatus = result;
    });

    return newNotes;
}

module.exports = {
    insertCard,
    insertNewCards
}
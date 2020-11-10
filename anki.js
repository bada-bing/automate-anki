const data = require("./data.js")
const insertNewCards = require("./insert.js").insertNewCards;
const { updateExistingNotes, collectDuplicates } = require("./update.js");


async function execute(){
  
  try {
    const words = await data.loadNewWords();

    let notes = words.map((word) => {
      return {
        primaryWord: word[0],
        description: word[1]
      }
    });
    
    notes = await insertNewCards(notes);
    
    // todo ... here create the list of all inserted cards in the 1st cycle and make a log statement out of it
    const duplicates = await collectDuplicates(notes);

    const updateResults = await updateExistingNotes(duplicates);
    console.log("DONE")
  } catch (e){
      console.log("There were some errors: ", e);
  }
}

// const result = await invoke("cardsInfo", 6, {
    //   cards: [1597646298752],
    // });

execute();
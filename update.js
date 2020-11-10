const { invoke, createUrls, createAnchors } = require("./utils.js");

const version = 6;
const deck = "test_1"

function findCard(primaryWord) {
  const action = "findNotes";
  const query = `deck:${deck} ${primaryWord}`;
  const params = {
      query
  };
    return invoke(action, version, params);
}

function getCurrentDescription(notes) {
  const action = "notesInfo";
  const params = { notes };
  return invoke(action, version, params);
}

async function updateSingleNote(note){
  const { id, primaryWord } = note;
  const action = "updateNoteFields";
  
  let content = note.noteInfo.fields.Back.value;
  const urls = createUrls(primaryWord);

  if (!content.includes(urls.dictcc) && !content.includes(urls.linguee)) {
    const anchors = createAnchors(primaryWord);
    content = content + "<br/>" + anchors;
  }
  content = content += "UPDATED <br/>" + note.description;
  
  const params = {
    note : {
      id,
      fields: {
        Front: primaryWord,
        Back: content
            }
        }
    }
  try {
    return invoke(action, version, params);
  } catch (e) {
    console.log("we have a problem", e);
  }
}

const splitter = (content) => {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length >= 1)
    .join("_");
};

async function updateExistingNotes(duplicates) {
  const currentEqualNewDescription = (note) => note.noteInfo.fields.Back.value.includes(note.description);

  const updateNotes = [];
  const notUpdatedNotes = [];
  
  duplicates.forEach(note => {
    if (currentEqualNewDescription(note)){
      notUpdatedNotes.push(note);
    } else {
      updateNotes.push(updateSingleNote(note))
    }
  });

  const results = await Promise.allSettled(updateNotes);
  return results;
}

async function collectDuplicates(notes) {
  const filter = (note) =>
    note.newCardStatus.status === "rejected" &&
    note.newCardStatus.reason ===
      "cannot create note because it is a duplicate";

  let duplicates = notes.filter(filter);
  let duplicatesIds = await getNoteId(duplicates);
  duplicatesIds = duplicatesIds.flat();
  
  const currentNotesInfo = await getCurrentDescription(duplicatesIds);
  
  duplicatesIds.forEach((id, idx) => {
    duplicates[idx].id = id;
    duplicates[idx].noteInfo = currentNotesInfo[idx]
    delete duplicates[idx].newCardStatus;
  })
  
  return duplicates;
}

function getNoteId(existingNotes) {
  const originals = [];
  existingNotes.forEach((note) => {
    originals.push(findCard(note.primaryWord));
  });
  return Promise.all(originals);
}

module.exports = {
  findCard,
  updateExistingNotes,
  collectDuplicates
};
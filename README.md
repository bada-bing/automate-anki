# automate-anki
The idea is to create the automation script which will create ANKI notes/cards out of records from CSV file

A small endeavor to automate my ANKI Spaced-Repetition Experience.

The focus is on automatic insertion of new words into ANKI DB.

Currently the words will be stored in CSV file with comma separator and 2 cols: word, description (i.e., translation) (if that doesn't fit use tab as separator)

Workflow:
1. For each word in the CSV file create:
	1.1. Primary Field - the Word
	1.2. Secondary Field - translation
	1.3. Secondary Field - links to dict.cc and linguee translations
2. Collect the list of Duplicates and merge them with existing cards
[] 	2.1  Create hash value of the existing description and the new description and if they are the same do not update the card
[] 4. Automatically determine the type of the word (e.g., der Hund is NOM)
	- you can use `trans` for that
[] 4. You can use the same approach to automatically inject translations as well (this way you will not need to insert them into CSV file)
[] 5. For nouns extract the article and the plural form


Examples:
Actions:
// await invoke("createDeck", { deck: "test1" });
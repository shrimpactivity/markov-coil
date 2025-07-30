const SuggestionMachine = require("../index");

console.log("");

const timer = () => {
  return {
    start: new Date().getTime(),
    value: function () {
      return new Date().getTime() - this.start;
    },
    refresh: function () {
      this.start = new Date().getTime();
    },
  };
};

const randomChoice = (list) => {
  const choiceIndex = Math.floor(Math.random() * list.length);
  return list[choiceIndex];
};

const createRandomBook = (wordCount) => {
  let book = "";
  let letters = ["a", "b", "c", "d", "e"];
  for (let i = 0; i < wordCount; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      book += randomChoice(letters);
    }
    book += " ";
  }
  return book;
};

for (let i = 0; i < 7; i += 1) {
  const book = createRandomBook(Math.pow(10, i));

  console.log("=============================");
  console.log("Testing with book of size: ", Math.pow(10, i));

  let time = timer();
  let list = book.split(" ");
  console.log("Time to split book into array: ", time.value());

  time.refresh();
  const sugg = new SuggestionMachine(list);
  console.log("Time to create machine: ", time.value());

  time.refresh();
  sugg.randomSuggestion();
  console.log("Time for a random suggestion: ", time.value());

  time.refresh();
  sugg.suggestFor("dog");
  console.log("Time to suggest word with one predecessor: ", time.value());
}

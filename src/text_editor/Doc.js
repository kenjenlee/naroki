/**
 * NOTE
 * 1. Each symbol should be its own Word node/object.
 */
import buckets from "buckets-js";
import Word, { DummyWord } from "./Word.js";

export default class Doc {
  constructor() {
    this.wordList = buckets.LinkedList();
    this.wordList.add(new DummyWord());
  }

  addText = (offset, text) => {
    if (text == " " || text == "Tab" || text == "Enter") {
      text = " ";
    }

    if (this.wordList.size() == 1) {
      // first character inserted
      let newNode;

      if (text == " ") {
        newNode = new Word();
        this.wordList.elementAtIndex(0).updateTrailingWhitespace(" ");
      } else {
        newNode = new Word(text);
      }

      this.wordList.add(newNode, 1);
      // console.log(this.wordList.size());
    } else {
      let offsetSum = 0,
        nodeIndex = 1,
        lastOffsetSum = 0;
      while (offsetSum < offset) {
        // console.log(lastOffsetSum);
        // console.log(nodeIndex);
        // console.log('get length');
        // console.log(this.wordList.elementAtIndex(nodeIndex).getLength());
        let node = this.wordList.elementAtIndex(nodeIndex);
        offsetSum += node.getLength();
        // console.log(offsetSum);
        if (
          offsetSum < offset ||
          (offsetSum == offset && node.trailingWhitespace)
        ) {
          lastOffsetSum = offsetSum;
          nodeIndex += 1;
        }
      }
      // console.log(this.wordList);
      // console.log(nodeIndex);
      // console.log(offset);
      // console.log(lastOffsetSum);
      if (text == " ") {
        let node = this.wordList.elementAtIndex(nodeIndex);
        let str = node.word.slice(offset - lastOffsetSum);
        let newNode = new Word(str);
        if (node.trailingWhitespace) {
          newNode.updateTrailingWhitespace(node.trailingWhitespace);
        }
        this.wordList.add(newNode, nodeIndex + 1);
        if(offset == lastOffsetSum) {
          node.updateTrailingWhitespace(
            node.trailingWhitespace ? node.trailingWhitespace + text : text
          );
        } else {
          node.updateTrailingWhitespace(
            text
          );
        }
        node.delChar(offset - lastOffsetSum, str.length);
      } else {
        this.wordList
          .elementAtIndex(nodeIndex)
          .addChar(offset - lastOffsetSum, text);
      }
    }
  };

  deleteText = () => {};

  modifyText = () => {};

  addMultiText = () => {};

  deleteMultiText = () => {};

  modifyMultiText = () => {};

  updateWordSpeechParam = () => {};

  /**
   * @function updateHighlightedSpeechParam
   * @param {boolean} forcedEqualValue if true then the param value for all highlighted text will be forced to be equal
   * if false then the relative change is equal.
   */
  updateHighlightedSpeechParam = (forcedEqualValue = false) => {};

  // TODO deal with different whitespace
  getString = () => {
    let str = "",
      i = 0;
    this.wordList.forEach(word => {
      let whitespace;
      // switch (word.trailingWhitespace) {
      //   case " ":
      //   case "Tab":
      //   case "Enter":
      //   default:
      //     whitespace = " ";
      //     break;
      // }
      // console.log(i);
      i += 1;
      // console.log(word.trailingWhitespace ? 'there is trailing whitespace ' + word.trailingWhitespace.replace(' ', 'd'): 'no trailing whitespace');
      let toConcat = word.trailingWhitespace
        ? word.word.concat(word.trailingWhitespace)
        : word.word;
      str = str.concat(toConcat);
      // console.log(str);
    });
    // remove leading and tailing space
    return str.trim();
  };
}

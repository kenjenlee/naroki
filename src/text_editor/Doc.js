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

  /**
   * 
   * Test Cases
   * 1. 'this is' -> 'this sis'
   */
  addText = (offset, text) => {
    if (text == " " || text == "Tab" || text == "Enter") {
      text = " ";
    }

    if (this.wordList.size() == 1) {
      // first character inserted
      let newNode;

      if (text == " ") {
        newNode = new Word();
        this.wordList.elementAtIndex(0).addChar(0, " ");
      } else {
        newNode = new Word(text);
      }

      this.wordList.add(newNode, 1);
      // console.log(this.wordList.size());
    } else {
      let offsetSum = 0,
        nodeIndex = 1,
        lastOffsetSum = 0,
        createNewNode = false;

      if (offset <= this.wordList.elementAtIndex(0).getLength()) {
        if (text == " ") {
          nodeIndex = 0;
        } else {
          createNewNode = true;
        }
        console.log("going to first node");
      } else {
        while (offsetSum < offset) {
          let node = this.wordList.elementAtIndex(nodeIndex);
          offsetSum += node.getLength();

          if (offsetSum < offset ||
            // below is from 'is some' -> 'is asome'
            (text != ' ' && this.wordList.elementAtIndex(nodeIndex + 1) && offset == offsetSum)) {
            console.log('JAJAJAJA');
            lastOffsetSum = offsetSum;
            nodeIndex += 1;
          } else {
            if (
              ((offset - lastOffsetSum) > node.getTrimmedLength() &&
                node.hasTrailingWhitespace() &&
                text != " ") ||
              (text == " " && (offset - lastOffsetSum) < node.getTrimmedLength())
            ) {
              // console.log(offset - lastOffsetSum);
              // console.log(node.getTrimmedLength());
              // lastOffsetSum = offsetSum;
              nodeIndex += 1;
              createNewNode = true;
            }
          }
        }
      }

      if (createNewNode) {
        if (text == " ") {
          // from "is something" to "is some thing"
            // console.log(this.getString());
            // console.log('createnewnode and text is space');
            // console.log(nodeIndex);
          let node = this.wordList.elementAtIndex(nodeIndex - 1);
          let newStr = node.word.slice(offset - lastOffsetSum);
          let newNode = new Word(newStr);
          this.wordList.add(newNode, nodeIndex);
          node.delChar(offset - lastOffsetSum, newStr.length);
          node.addChar(offset - lastOffsetSum, text);
          // console.log(node.word);
          // console.log(newNode.word);
        } else {
          // from "some  thing" to "some h thing"
          console.log('IAHOIAHAOI');
          let node = this.wordList.elementAtIndex(nodeIndex - 1);
          let newStr = node.word.slice(offset - lastOffsetSum);
          let newNode = new Word(text + newStr);
          this.wordList.add(newNode, nodeIndex);
          node.delChar(offset - lastOffsetSum, newStr.length);
        }
      } else {
        this.wordList
          .elementAtIndex(nodeIndex)
          .addChar(offset - lastOffsetSum, text);
      }
    }
  };

  deleteText = (offset, length) => {
    // let offsetSum = 0,
    //   nodeIndex = 1,
    //   lastOffsetSum = 0;
    // while (offsetSum < offset) {
    //   // console.log(lastOffsetSum);
    //   // console.log(nodeIndex);
    //   // console.log('get length');
    //   // console.log(this.wordList.elementAtIndex(nodeIndex).getLength());
    //   let node = this.wordList.elementAtIndex(nodeIndex);
    //   offsetSum += node.getLength();
    //   // console.log(offsetSum);
    //   if (
    //     offsetSum < offset ||
    //     (offsetSum == offset && node.trailingWhitespace)
    //   ) {
    //     lastOffsetSum = offsetSum;
    //     nodeIndex += 1;
    //   }
    // }
  };

  /**
   * @function deleteChar delete a single character from the doc
   * 
   * 
   * Test Cases:
   *  1. 'one potato haha' -> 'one potato hah'
   *  2. 'one potato haha' -> 'one potato haa'
   *  3. 'one potato haha' -> 'one potato aha'
   *  4. 'one potato haha' -> 'one potat haha'
   *  5. 'one potato  haha' -> 'one potato haha'
   *  6. 'one potato haha' -> 'one potatohaha'
   *    number of nodes in wordList decreases by one
   *  7. 'one i haha' -> 'one  haha'
   *     number of nodes in wordList decreases by one
   */
  deleteChar = offset => {
    if(offset >= this.getString().length) return;
    let offsetSum = 0,
      nodeIndex = 0,
      lastOffsetSum = 0;
    while (offsetSum <= offset) {
      // console.log(lastOffsetSum);
      // console.log(nodeIndex);
      // console.log('get length');
      // console.log(this.wordList.elementAtIndex(nodeIndex).getLength());
      let node = this.wordList.elementAtIndex(nodeIndex);
      offsetSum += node.getLength();
      // console.log(offsetSum);
      if (offsetSum <= offset) {
        lastOffsetSum = offsetSum;
        nodeIndex += 1;
      }
    }
    let node = this.wordList.elementAtIndex(nodeIndex);
    console.log(nodeIndex);
    node.delChar(offset - lastOffsetSum, 1);
    if (nodeIndex > 0 && node.getTrimmedLength() == 0) {
      // previous node eats this node up if this node only has whitespace in it
      let prevNode = this.wordList.elementAtIndex(nodeIndex - 1);
      if (node.getLength() > 0) {
        prevNode.addChar(prevNode.getLength(), node.word);
      }
      prevNode.updateDeletedNodesPointer(node);
      this.wordList.removeElementAtIndex(nodeIndex);
    } else if (
      nodeIndex > 0 &&
      node.getLength() == node.getTrimmedLength() &&
      nodeIndex < this.wordList.size()-1
    ) {
      console.log(this.wordList.size());
      console.log(nodeIndex);
      // this node eats next node up if this node no longer have trailing whitespace
      let nextNode = this.wordList.elementAtIndex(nodeIndex + 1);
      node.addChar(node.getLength(), nextNode.word);
      node.updateDeletedNodesPointer(nextNode);
      this.wordList.removeElementAtIndex(nodeIndex + 1);
    }
  };

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
      i += 1;
      str = str.concat(word.word);
      // console.log(str.length);
      console.log(str.replace(/\s/g, "X"));
    });
    // remove leading and tailing space
    // return str.trim();
    console.log(this.wordList.size());
    return str.replace(/\s/g, "X");
  };
}

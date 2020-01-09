// NOTE any symbols like , and . might have a default pause associated
// with it in the Nuance package, but is still stated as 0 here.
import buckets from 'buckets-js';


export default class Word {
  constructor(char = '') {

    /**
     * w - word change
     * p - speech parameter change
     * d - appended new deleted node
     * s - change trailing whitespace
     */
    this.changeTypeSequence = [];
    this.changeTypeSequenceIndex = -1;
    if(char.length > 0) {
      this.changeTypeSequence.push('w');
      this.changeTypeSequenceIndex += 1;
    }

    this.word = char;
    this.wordChangeIndex = -1;
    this.wordChanges = [];
    if(char.length > 0) {
      this.addWordChange('INS', 0, char);
    }
    
    this.speechParam = new SpeechParam();
    this.speechParamChanges = [];
    this.speechParamChangeIndex = -1;


    this.deletedNodesPointer = buckets.LinkedList();
    

    this.trailingWhitespace = '';
    this.trailingWhitespaceChanges= [];
    this.trailingWhitespaceChangeIndex = -1;
  }

  addChangeType = (type) => {
    if(this.changeTypeSequenceIndex == this.changeTypeSequence.length) {
      this.changeTypeSequence.push(type);
    } else {
      this.changeTypeSequence[this.changeTypeSequenceIndex + 1] = type;
    }
    this.changeTypeSequenceIndex += 1;
  }

  addWordChange = (action, index, str) => {
    this.addChangeType('w');
    if(this.wordChangeIndex == this.wordChanges.length - 1) {
      // no undos have been done
      this.wordChanges.push(new WordChange(action, index, str));
    } else {
      this.wordChanges[this.wordChangeIndex+1] = new WordChange(action, index, str);
    }
    this.wordChangeIndex += 1;
  }

  addChar = (index, char) => {
    // console.log("Index is");
    // console.log(index);
    this.addWordChange('INS', index, char);
    if(index == 0) {
      this.word = char + this.word;
    } else {
      this.word = this.word.slice(0, index) + char + this.word.slice(index);
    }
  }

  delChar = (index, len) => {
    if(len < 1) {return;}
    console.log(index);
    console.log(len);
    this.addWordChange('DEL', index, this.word.slice(index, index+len));
    if(index == 0) {
      this.word = this.word.slice(len);
    } else {
      let temp1 = this.word.slice(0, index);
      let temp2 = this.word.slice(index+len);
      console.log(temp1);
      console.log(temp1.length);
      console.log(temp2);
      this.word = this.word.slice(0, index) + this.word.slice(index+len);
    }
    console.log(this.word);
  }

  updateSpeechParam = (paramName, paramValue) => {
    this.addChangeType('p');
    // update speech changes over time
    if(this.speechParamChangeIndex == this.speechParamChanges.length - 1) {
      this.speechParamChanges.push(new SpeechParamChange(paramName, paramValue));
    } else {
      this.speechParamChanges[this.speechParamChangeIndex+1] = new SpeechParamChange(paramName, paramValue);
    }
    this.speechParamChangeIndex += 1;

    // update actual current speech params
    this.speechParam.paramName = paramValue;
  }

  updateDeletedNodesPointer = (node) => {
    this.deletedNodesPointer.add(node, this.deletedNodesPointer.size());
    // TODO add addChangeType and stuff
  }

  // updateTrailingWhitespace = (whitespace) => {
  //   this.addChangeType('s');
  //   let change = {old: this.trailingWhitespace, new: whitespace};
  //   if(this.trailingWhitespaceChangeIndex == this.trailingWhitespaceChanges.length - 1) {
  //     this.trailingWhitespaceChanges.push(change);
  //   } else {
  //     this.trailingWhitespaceChanges[this.trailingWhitespaceChangeIndex+1] = change;
  //   }
  //   this.trailingWhitespaceChangeIndex += 1;

  //   // update actual current speech params
  //   this.trailingWhitespace = whitespace;
  // }

  undo = () => {}

  redo = () => {}

  getLength = () => {
    // return this.word.length + (this.trailingWhitespace ? this.trailingWhitespace.length : 0);
    return this.word.length;
  }

  hasTrailingWhitespace = () => {
    // does not matter how long the trailing whitespace is
    return this.word.slice(-1) === ' ';
  }

  getTrimmedLength = () => {
    return this.word.trim().length;
  }

}

// acts as Dummy word with no word or params, just a pointer to deleted nodes
export class DummyWord extends Word {
  // TODO throw errors???
  addChar = (index, char) => {
    if(char.trim().length > 0) {return;}
    this.addWordChange('INS', index, char);
    if(index == 0) {
      this.word = char + this.word;
    } else {
      this.word = this.word.slice(0, index) + char + this.word.slice(index);
    }
    
  }

  updateSpeechParam = (paramName, paramValue) => {
    if(paramName != 'pause') {
      throw Error('DummyWord can only have a pause speech parameter.');
    }
    this.addChangeType('p');
    // update speech changes over time
    if(this.speechParamChangeIndex == this.speechParamChanges.length - 1) {
      this.speechParamChanges.push(new SpeechParamChange(paramName, paramValue));
    } else {
      this.speechParamChanges[this.speechParamChangeIndex+1] = new SpeechParamChange(paramName, paramValue);
    }
    this.speechParamChangeIndex += 1;

    // update actual current speech params
    this.speechParam.paramName = paramValue;
  }
}

class WordChange {
  constructor(action, index, str) {
    if(action != "INS" && action != 'DEL') {
      console.log(action);
      throw Error("Action is not INS or DEL", 'Word.js');
    }
    this.action = action;
    this.index = index;
    this.str = str;
    // if(action == 'DEL' && len===0) throw Error('DEL action must remove more than 0 character', 'Word.js', 45);
    // this.len = len;
  }
}

class SpeechParam {
  constructor(pitch=100, speed=1, pause=0) {
    // pause is after the word associated with this set of param
    this.pitch = pitch;
    this.speed = speed;
    this.pause = pause;
  }
}

// TODO implemented in nnw class for type/range checking to be done
class SpeechParamChange {
  constructor(paramName, paramValue) {
    this.paramName = paramName;
    this.paramValue = paramValue;
  }
}
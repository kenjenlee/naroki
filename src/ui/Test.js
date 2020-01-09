import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import buckets from 'buckets-js'
import Doc from '../text_editor/Doc';
import {keys} from '../text_editor/Const.js'
// import styled from 'styled-components'
// import { Floater, MenuBar } from '@aeaton/react-prosemirror'
// import { options, menu } from '@aeaton/react-prosemirror-config-default'
// import Editor from './text_editor/Editor.js'
// import { EditorState } from 'prosemirror-state'
// import { EditorView } from 'prosemirror-view'
// import SetDocAttr from './text_editor/SetDocAttr.js'


// const Container = styled('div')`
//   position: absolute;
//   top: 10vh;
//   left: 0;
//   right: 0;
//   bottom: 0;
// `

// const Input = styled('div')`
//   width: 100%;
//   height: 50%;
//   overflow-y: auto;
// `

// const Output = styled('pre')`
//   width: 100%;
//   height: 50%;
//   overflow-y: auto;
//   padding: 1em;
//   background: black;
//   color: lawngreen;
//     `

// export default class Test extends Component {
//   constructor(props) {
//     super(props);
//     // this.state = {
//     //   state: 
//     // };
//     this.view = new EditorView(null, {
//       state: EditorState.create(options),
//       dispatchTransaction: this.dispatchTransaction,
//       attributes: this.props.attributes,
//       nodeViews: this.props.nodeViews
//     })
//   }

//   dispatchTransaction = transaction => {
//     const { state, transactions } = this.view.state.applyTransaction(transaction);

//     this.view.updateState(state);

//     if (transactions.some(tr => tr.docChanged)) {
//       document.getElementById('output').textContent = JSON.stringify(state.doc, null, 2);
//       console.log(state.doc);
//       transactions.forEach(tr => {
//         if(tr.docChanged) {
//           console.log("Transform will be printed");
//           console.log(tr.steps[0].getMap().ranges); //[start, oldSize, newSize]
//           // if newSize-oldSize == 1 -> insert -> inserted char returned
//           // if newSize == oldSize -> replace -> replacement char returned
//           // if oldSize-newSize == 1 -> delete -> no char returned
//           console.log(tr);
//           console.log(tr.steps[0].slice.content.content[0].text);  // text inserted
//         }
//       })
//     }

//     this.forceUpdate();
//   }

//   handleButtonClick = () => {
//     const transaction = this.view.state.tr
//       .step(new SetDocAttr('foo', 'bar'))
//       .step(new SetDocAttr('bar', ['foo', 'foo']));
//     this.dispatchTransaction(transaction);
//   }

//   render() {
//     return (
//       <Container>
//         <button onClick={this.handleButtonClick}>haha</button>
//         <Input>
//           <Editor
//             view={this.view}
//             render={({ editor, view }) => (
//               <React.Fragment>
//                 <MenuBar menu={menu} view={view} />

//                 <Floater view={view}>
//                   <MenuBar menu={{ marks: menu.marks }} view={view} />
//                 </Floater>

//                 {editor}
//               </React.Fragment>
//             )}
//           />
//         </Input>
//         <Output id={'output'} />
//       </Container>
//     );
//   }
// }

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: new Doc(),
      highlightedRegion: {anchorOffset: 0, focusOffset: 0},
      isHighlighted: false,
      prevCursorOffset: -1,
      rawInput: "",
      prevKey: '',
      reundo: false,
    };
    

  }

  // TODO Inefficient code here called redundantly by both keyup and mouseup
  checkTextIsHighlighted = () => {
    // console.log(window.getSelection());
    let selection = window.getSelection();
    if(selection.anchorOffset != selection.focusOffset 
      && selection.anchorNode.nodeName == "#text"
      && selection.focusNode.nodeName == "#text") {
        this.setState({
          highlightedRegion: {anchorOffset: selection.anchorOffset, focusOffset: selection.focusOffset},
          isHighlighted: true
        });
        console.log("here");
    } else if(this.state.isHighlighted) {
      this.setState({
        isHighlighted: false
      });
    }
  }

  handleKeyDown = (e) => {
    console.log(window.getSelection());
    if(keys.navigation.includes(e.key)) {
      return; // dealt with in key up event
    }
    this.setState({isHighlighted: false});
    // prevent default for undo and redo. Implement own logic.
    if(e.ctrlKey && (e.key == 'z' || e.key == 'y' || e.key == 'Z' || e.key == 'Y')) {
      e.preventDefault();
      this.setState({reundo: true});
      if(e.key == 'z') {
        // trigger custom undo logic
      } else if(e.key == 'y') {
        // triger custom redo logic
      }
      return;
    } else if(!keys.navigation.includes(e.key)) {
      // e.type == keyup and non-navigation, no highlighted region
      this.setState({isHighlighted: false});
      if(keys.whitespace.includes(e.key)) {
        // whitespace character
        let temp = this.state.doc;
        temp.addText(window.getSelection().focusOffset, e.key);
        this.setState({
          doc: temp
        });
        console.log(this.state.doc.getString());
      } else if(e.key.length == 1 && !e.ctrlKey) {
        // printable character
        // console.log('this is a printable non-whitespace character');
        // console.log(window.getSelection().focusOffset);
        // console.log(e.key);
        let temp = this.state.doc;
        temp.addText(window.getSelection().focusOffset, e.key);
        this.setState({
          doc: temp
        });
        console.log(this.state.doc.getString());
      } else if(e.ctrlKey) {
        switch(e.key) {
          case 'x':
          case 'X':
            break;
          case 'v':
          case 'V':
            break;
          default:
            break;
        }
      } else {
        switch(e.key) {
          case 'Backspace':
            break;
          case 'Clear':
            break;
          case 'Cut':
            break;
          case 'Delete':
            break;
          case 'Paste':
            break;
          default:
            break;
        }
      }
    }
    // console.log(window.getSelection().nodeName);
    this.setState({
      prevKey: e.key, 
      prevCursorOffset: 
        window.getSelection().focusOffset
    });
    
    this.setState({reundo: false});
  }

  // TODO bug where if you press shift+char quickly the capital letter is printed
  // but the small letter is passed into the event first after the shift key
  handleKeyMouseUp = (e) => {
    // cut paste needs to be here as well????///// TODO


    // if it's whitespace character (tab, space, enter)
    // console.log(e.key);
    // console.log(e.type);
    if(e.type == 'mouseup' || keys.navigation.includes(e.key)) {
      // navigation event, change of cursor position
      this.checkTextIsHighlighted();
    }
    // console.log(window.getSelection().nodeName);
    this.setState({
      prevKey: e.key, 
      prevCursorOffset: 
        window.getSelection().focusOffset
    });
    // console.log(e.target.value);
    // if it's backspace/delete
    // below also includes arrow keys
    // if(strlen(String.fromCharCode(e.keyCode))) {
    //   console.log(window.getSelection());
    //   console.log(e.keyCode);
    // }
    
  }

  render() {
    return (
      <div contentEditable="true" style={{border: "1px solid #ccc", width: '50vw', height: "50vh"}}
        onKeyUp={this.handleKeyMouseUp}
        onMouseUp={this.handleKeyMouseUp}
        onKeyDown={this.handleKeyDown}
      >

      </div>
    );
  }
}

// import React from 'react';
// import ReactDOM from 'react-dom';
// import {Editor, EditorState} from 'draft-js';
// export default class Test extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {editorState: EditorState.createEmpty()};
//     this.onChange = editorState => {
//       if(this.state.editorState.getCurrentContent() != editorState.getCurrentContent()) {
//         console.log('current content is not the same');
//         console.log(editorState.getCurrentContent().getSelectionBefore());
//         console.log(editorState.getCurrentContent().getSelectionAfter());
//         console.log(editorState.getCurrentContent().getBlockMap());
//       }
//       if(this.state.editorState.getSelection() != editorState.getSelection()) {
//         console.log('selection is not the same');
//       }
//       this.setState({editorState}); 
      
//       // console.log(editorState.getCurrentContent().getEntityMap())
//     };
//   }
//   render() {
//     return (
//       <Editor editorState={this.state.editorState} onChange={this.onChange} />
//     );
//   }
// }
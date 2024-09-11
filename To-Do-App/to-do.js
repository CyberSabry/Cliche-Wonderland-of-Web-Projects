import Utility from "../main.js";

const textInput = document.querySelector('.text-input');
const addButton = document.querySelector('.add-button');
const downloadButton = document.querySelector('.download-button');
const downloadButtonAnchor = document.querySelector('.download-button__anchor')
const listContainer = document.querySelector('.container');
const list = document.querySelector('.list');
const label = document.querySelector('.label');
// Just so we can make unique id for each to-do task.
let listItemsCount = 0;
// Popups can see if user have a popup already on.
let isDeletePopupOpen = false;
// For managing not having more than one edit process at once.
let isEditStateOn = false;
let currentEditState = null;
// All notes stored in one array.
let allNotes = [];
// The whole list item with all of it`s functions: edit and delete.
class Note {
  constructor (text) {
    this.content = text;
    this.id = this.generateID();
    this.isChecked = false;
    this.isEditable = false;

    this.listItem = Utility.createHTML(`
      <li id="${this.id}" class="list__item"></li>
    `)
    this.checkbox = Utility.createHTML(`
      <input type="checkbox" class="item__checkbox">
    `)
    this.paragraph = Utility.createHTML(`
      <p class="item__paragraph">${this.content}.</p>
    `)
    this.deleteButton = Utility.createHTML(`
      <button class="item__button item__button--delete">Delete</button>
    `)
    this.editButton = Utility.createHTML(`
      <button class="item__button item__button--edit">Edit</button>
    `)

    this.paragraph.setAttribute('contenteditable', this.isEditable);
    Utility.appendChildren(this.listItem, [
      this.checkbox,
      this.paragraph,
      this.editButton,
      this.deleteButton
    ]);
    list.appendChild(this.listItem);
    allNotes.push(this);
    console.log(allNotes);
    this.checkbox.addEventListener('click', this.setAsChecked.bind(this));
    this.deleteButton.addEventListener('click', this.getConfirmationMassage.bind(this));
    this.editButton.addEventListener('click', this.startEditState.bind(this));
  };

  generateID() {
    return allNotes.length;
  };

  getNewNote() {
    return this.listItem;
  };

  setAsChecked() {
    if(!this.isChecked) {
      this.isChecked = true;
      Utility.hide(this.editButton);
    }
    else {
      this.isChecked = false;
      Utility.show(this.editButton);
    }
  }
  startEditState() {
    if(isEditStateOn) {
      const currentNoteOldText = currentEditState.content;

      currentEditState.cancelEditState(currentNoteOldText);
    }
    isEditStateOn = true;
    currentEditState = this;
    this.isEditable = true;
    this.paragraph.classList.add('item__paragraph--edit-state');
    this.paragraph.setAttribute('contenteditable', this.isEditable);
    Utility.placeCursorAtEnd(this.paragraph);
    this.confirmButton = Utility.createHTML(`
      <button class="item__button item__button--confirm">Confirm</button>    
    `);
    this.cancelButton = Utility.createHTML(`
      <button class="item__button item__button--cancel">Cancel</button>    
    `);
    Utility.hide(
      this.checkbox,
      this.editButton, 
      this.deleteButton
    );
    Utility.appendChildren(this.listItem, [
      this.confirmButton,
      this.cancelButton
    ]);
    this.paragraph.focus();
    this.confirmButton.addEventListener('click', () => { this.saveEditedNote(); })
    this.cancelButton.addEventListener('click', () => { this.cancelEditState(); })
  };

  cancelEditState() {
    isEditStateOn = false;
    currentEditState = null;
    this.isEditable = false;
    this.paragraph.classList.remove('item__paragraph--edit-state');
    this.paragraph.setAttribute('contenteditable', this.isEditable);
    this.paragraph.textContent = this.content;
    Utility.remove(
      this.confirmButton, 
      this.cancelButton
    );
    Utility.show(
      this.checkbox,
      this.editButton, 
      this.deleteButton
    );
  };

  saveEditedNote() {
    isEditStateOn = false;
    currentEditState = null;
    this.isEditable = false;
    this.paragraph.classList.remove('item__paragraph--edit-state');
    this.paragraph.setAttribute('contenteditable', this.isEditable);
    const newText = this.paragraph.textContent.trim();
    this.content = newText;
    this.paragraph.textContent = this.content;
    Utility.remove(
      this.confirmButton, 
      this.cancelButton
    );
    Utility.show(
      this.checkbox,
      this.editButton, 
      this.deleteButton
    );
    if (newText === '') {
      this.deleteNote();
    }
    updateUI();
  };

  getConfirmationMassage() {
    new ConfirmationPopup(this, 'Are you sure you want to delete this note?');
  };

  deleteNote() {
    this.listItem.remove();
    allNotes.splice(this.id, 1);
    updateUI();
    delete this;
  };
};
// A popup that waits for you to make your decision.
class ConfirmationPopup {
  constructor(note, massage) {
    if(isDeletePopupOpen) {
      return;
    }
    isDeletePopupOpen = true;
    this.note = note;

    this.background = Utility.createHTML(`
      <div class="popup-background"></div>    
    `)
    this.popup = Utility.createHTML(`
      <div class="popup"></div>
    `)
    this.massage = Utility.createHTML(`
      <p class="popup__massage">${massage}</p>        
    `)
    this.buttonsContainer = Utility.createHTML(`
      <div class="popup__controls-container"></div>     
    `)
    this.confirmationButton = Utility.createHTML(`
      <button class="popup__button popup__button--yes">Yes</button>
    `)
    this.cancelationButton = Utility.createHTML(`
      <button class="popup__button popup__button--no">No</button>
    `)

    Utility.appendChildren(this.popup, [
      this.massage,
      this.buttonsContainer
    ]);
    Utility.appendChildren(this.buttonsContainer, [
      this.confirmationButton,
      this.cancelationButton
    ]);
    this.background.appendChild(this.popup);
    document.body.appendChild(this.background);

    this.confirmationButton.addEventListener('click', this.confirm.bind(this));
    this.cancelationButton.addEventListener('click', this.deletePopup.bind(this));
  }

  confirm() {
    this.note.deleteNote();
    isDeletePopupOpen = false;
    this.deletePopup();
  }

  deletePopup() {
    isDeletePopupOpen = false;
    Utility.remove(this.background);
    delete this;
  }
};
// Download manager popup.
class DownloadManager {
  constructor() {

    this.textContent = '';

    allNotes.forEach(note => {
      if(note.isChecked) {
        this.textContent += `{-Checked-} => ${note.content} \n\n\n`;
      }
      else {
        this.textContent += `${note.content} \n\n\n`;
      }
    })
    
    this.downloadManager = Utility.createHTML(`
      <div class="download-manager"></div>  
    `);
    this.title = Utility.createHTML(`
      <h2 class="download-manager__title">Download</h2>  
    `);
    this.fileName = Utility.createHTML(`
      <p class="download-manager__file-name" contenteditable="true">To-Do</p>  
    `)
    this.content = Utility.createHTML(`
      <pre class="download-manager__content" contenteditable="true">${this.textContent}</pre>
    `);
    this.dialogBox = Utility.createHTML(`
      <div class="download-manager__dialog-box"></div>  
    `);
    this.downloadBtn = Utility.createHTML(`
      <a class="dialog-box__btn dialog-box__btn--download">Download</a>  
    `);
    this.cancelBtn = Utility.createHTML(`
      <button class="dialog-box__btn dialog-box__btn--cancel">Cancel</button>  
    `);

    Utility.appendChildren(this.downloadManager, [
      this.title,
      this.fileName,
      this.content,
      this.dialogBox
    ]);
    Utility.appendChildren(this.dialogBox, [
      this.downloadBtn,
      this.cancelBtn
    ]);
    document.body.appendChild(this.downloadManager);

    this.downloadBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      this.createTxtFile(this.textContent)
    });
  }
  // Takes all the added notes and puts them in a (txt) file that you download on your computer.
  createTxtFile(textContent) {
    let fileName = this.fileName.textContent.trim();
    
      const blob = new Blob([textContent], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      this.downloadBtn.href = url;
      this.downloadBtn.download = fileName + '.txt';
      URL.revokeObjectURL(url);
      console.log(fileName)
      console.log('download should be triggerd')
  };
};
// this one should be the main function that combines them all
function createToDoListItem() {
  let isInputEmpty = checkEmptyInput(textInput.value);
  let text = textInput.value

  if (isInputEmpty) {
    label.innerHTML = 'Write something dude.';
  }
  else {
    const note = new Note(text);
    note.getNewNote();
    label.innerHTML = 'Please pretend that you saw this idea for the first time and embrace it';
    Utility.resetInput(textInput);
    updateUI();
  }
};
// Checks if the input is empty it returns true and if its not empty its false.
function checkEmptyInput(input) {
  if (input === '') {
    return true;
  }
  else {
    return false;
  }
};
// Updates the container visibility so if we don`t have any notes inside it hides it.
function updateUI() {
  if (list.children.length > 0) {
    Utility.show(
      listContainer,
      downloadButton
    );
  }
  else {
    Utility.hide(
      listContainer,
      downloadButton
    );
  }
};
// Stuff happens when you first load the page!.
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (event) => { 
    if(event.key === '/') { 
      event.preventDefault(); 
      textInput.focus();
    };
  });
  textInput.addEventListener('keydown', (event) => { if(event.key === 'Enter') { createToDoListItem(); /*createTxtFile();*/ } });
  addButton.addEventListener('click', () => { createToDoListItem(); /*createTxtFile();*/});
  document.querySelector('#test').addEventListener('click', () => { new DownloadManager })
});
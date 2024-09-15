import Utility from "../main.js";

const textInput = document.querySelector('.text-input');
const addButton = document.querySelector('.add-button');
const downloadButton = document.querySelector('.download-button');
const downloadButtonAnchor = document.querySelector('.download-button__anchor')
const listContainer = document.querySelector('.container');
const list = document.querySelector('.list');
const label = document.querySelector('.label');

// State management.
const state = {
  isDeletePopupOpen: false,
  isEditStateOn: false,
  currentEditState: null,
  allTasks: []
}

class Task {
  constructor (text) {
    this.content = text;
    this.id = state.allTasks.length;
    this.isChecked = false;
    this.isEditable = false;

    this.createElements();
    this.appendElements();
    this.createEventListeners();
    this.appendTaskTo(list);





    state.allTasks.push(this);
  };

  createElements() {
    this.task = Utility.createHTML(`<li id="${this.id}" class="list__item"></li>`)
    this.checkbox = Utility.createHTML(`<input type="checkbox" class="item__checkbox">`)
    this.paragraph = Utility.createHTML(`<p class="item__paragraph">${this.content}.</p>`)
    this.paragraph.setAttribute('contenteditable', this.isEditable);
    this.deleteButton = Utility.createHTML(`<button class="item__button item__button--delete">Delete</button>`)
    this.editButton = Utility.createHTML(`
      <button class="item__button item__button--edit">
        <svg class="item__button--edit__icon">
          <use href="#edit-icon" />
        </svg>
      </button>
    `)
  };

  appendElements() {
    Utility.appendChildren(this.task, [
      this.checkbox,
      this.paragraph,
      this.editButton,
      this.deleteButton
    ]);
  };

  createEventListeners() {
    this.checkbox.addEventListener('click', this.setAsChecked.bind(this));
    this.deleteButton.addEventListener('click', this.getConfirmationMassage.bind(this));
    this.editButton.addEventListener('click', this.startEditState.bind(this));
  };

  appendTaskTo(parent) {
    parent.appendChild(this.task)
  };
  // Marks task as done and hides 'edit' button.
  setAsChecked() {
    this.isChecked = !this.isChecked;
    this.isChecked ? Utility.hide(this.editButton) : Utility.show(this.editButton);
  };
  // Toggles edit state: hides 'edit'/'delete', shows 'confirm'/'cancel'.
  // Cancels any active edit in another task and starts new edit.
  startEditState() {
    if(state.isEditStateOn) {
      const currentTaskContent = state.currentEditState.content;
      state.currentEditState.cancelEditState(currentTaskContent);
    }
    state.isEditStateOn = true;
    state.currentEditState = this;
    this.isEditable = true;

    this.createEditButtons();
    this.enableEdit(this.paragraph);
    Utility.hide(
      this.checkbox,
      this.editButton, 
      this.deleteButton
    );
    this.paragraph.focus();
  };
  // Makes element editable, consider adding an '--edit-state' class for styling.
  enableEdit(element, isEditable) {
    const className = element.classList[0];
    element.classList.add(className + '--edit-state');
    element.setAttribute('contenteditable', isEditable);
    Utility.placeCursorAtEnd(element);
  }
  // Creates confirm/cancel buttons, adds listeners, and appends to task.
  createEditButtons() {
    this.confirmButton = Utility.createHTML(`<button class="item__button item__button--confirm">Confirm</button>`);
    this.cancelButton = Utility.createHTML(`<button class="item__button item__button--cancel">Cancel</button>`);
    this.confirmButton.addEventListener('click', () => {this.saveEditedNote();})
    this.cancelButton.addEventListener('click', () => {this.cancelEditState();})
    Utility.appendChildren(this.task, [this.confirmButton, this.cancelButton]);
  }

  cancelEditState() {
    state.isEditStateOn = false;
    state.currentEditState = null;
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
    state.isEditStateOn = false;
    state.currentEditState = null;
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
    this.task.remove();
    state.allTasks.splice(this.id, 1);
    updateUI();
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

    state.allTasks.forEach(note => {
      if(note.isChecked) {
        this.textContent += `{-Checked-} => ${note.content} \n-\n`;
      }
      else {
        this.textContent += `${note.content} \n-\n`;
      }
    })
    this.background = Utility.createHTML(`
      <div class="download-manager-background"></div>  
    `)
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

    this.background.appendChild(this.downloadManager);
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
    document.body.appendChild(this.background);

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
    const task = new Task(text);
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
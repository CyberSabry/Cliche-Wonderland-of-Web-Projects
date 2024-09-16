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

    this.createUI();
    this.createEventListeners();
    this.appendTaskTo(list);

    state.allTasks.push(this);
  }

  createUI() {
    this.task = Utility.createHTML(`<li id="${this.id}" class="list__item"></li>`);
    this.checkbox = Utility.createHTML(`<input type="checkbox" class="item__checkbox">`);
    this.paragraph = Utility.createHTML(`<p class="item__paragraph">${this.content}.</p>`);
    this.deleteButton = Utility.createHTML(`<button class="item__button item__button--delete">Delete</button>`);
    this.editButton = Utility.createHTML(`
      <button class="item__button item__button--edit">
        <svg class="item__button--edit__icon">
          <use href="#edit-icon" />
        </svg>
      </button>
    `);
    Utility.appendChildren(this.task, [this.checkbox, this.paragraph, this.editButton, this.deleteButton]);
  }

  createEventListeners() {
    this.checkbox.addEventListener('click', this.setAsChecked.bind(this));
    this.deleteButton.addEventListener('click', this.beginDelete.bind(this));
    this.editButton.addEventListener('click', this.startEditState.bind(this));
  }

  appendTaskTo(parent) {
    parent.appendChild(this.task)
  }
  // Marks task as done and hides 'edit' button.
  setAsChecked() {
    this.isChecked = !this.isChecked;
    this.isChecked ? Utility.hide(this.editButton) : Utility.show(this.editButton);
  }
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
    this.toggleEdit(this.paragraph, this.isEditable);
    Utility.hide(this.checkbox, this.editButton, this.deleteButton);
    this.paragraph.focus();
  }
  // Saves the edited note, updates the content, resets edit state, and handles UI changes.
  saveEdit() {
    state.isEditStateOn = false;
    state.currentEditState = null;
    this.isEditable = false;

    const newText = this.paragraph.textContent.trim();
    this.toggleEdit(this.paragraph, this.isEditable);
    this.content = newText;
    this.paragraph.textContent = this.content;
    Utility.remove(this.confirmButton, this.cancelButton);
    Utility.show(this.checkbox, this.editButton, this.deleteButton);
    if (newText === '') {
      this.deleteTask();
    }
    updateUI();
  }
  // Cancels the edit state and brings back old buttons.
  cancelEditState() {
    state.isEditStateOn = false;
    state.currentEditState = null;
    this.isEditable = false;

    this.paragraph.textContent = this.content;
    this.toggleEdit(this.paragraph, this.isEditable);
    this.removeEditButtons();
    Utility.show(this.checkbox, this.editButton, this.deleteButton);
  }
  // Toggles element's editable state and applies '--edit-state' class for styling.
  toggleEdit(element, isEditable) {
    const className = element.classList[0];
    if(isEditable) {
      element.classList.add(className + '--edit-state');
      Utility.placeCursorAtEnd(element);
    }
    else {
      element.classList.remove(className + '--edit-state');
    }
    element.setAttribute('contenteditable', isEditable);
  }
  // Creates confirm/cancel buttons, adds listeners, and appends to task.
  createEditButtons() {
    this.confirmButton = Utility.createHTML(`<button class="item__button item__button--confirm">Confirm</button>`);
    this.cancelButton = Utility.createHTML(`<button class="item__button item__button--cancel">Cancel</button>`);
    this.confirmButton.addEventListener('click', () => {this.saveEdit();})
    this.cancelButton.addEventListener('click', () => {this.cancelEditState();})
    Utility.appendChildren(this.task, [this.confirmButton, this.cancelButton]);
  }
  // Removes confirm/cancel buttons, and their listeners.
  removeEditButtons() {
    Utility.remove(this.confirmButton, this.cancelButton);
  }

  beginDelete() {
    const popup = new ConfirmationPopup(this, 'Are you sure you want to delete this task?')
    popup.getPromise()
    .then(() => {
      this.deleteTask();
    })
    .catch(() => {
      console.log('Task deletion canceled.')
    })
  }

  deleteTask() {
    this.task.remove();
    state.allTasks.splice(this.id, 1);
    updateUI();
  }
};
// A popup that waits for you to make your decision.
class ConfirmationPopup {
  constructor(note, massage) {
    if(state.isDeletePopupOpen) {
      return;
    }
    state.isDeletePopupOpen = true;
    this.note = note;

    this.createUI(massage);
    this.appendPopupTo(document.body);
    this.createEventListeners();
    this.getPromise();
  }

  createUI(massage) {
    this.background = Utility.createHTML(`<div class="popup-background"></div>`);
    this.popup = Utility.createHTML(`<div class="popup"></div>`);
    this.massage = Utility.createHTML(`<p class="popup__massage">${massage}</p>`);
    this.buttonsContainer = Utility.createHTML(`<div class="popup__controls-container"></div>`);
    this.confirmationButton = Utility.createHTML(`<button class="popup__button popup__button--yes">Yes</button>`);
    this.cancelationButton = Utility.createHTML(`<button class="popup__button popup__button--no">No</button>`);
    Utility.appendChildren(this.popup, [this.massage, this.buttonsContainer]);
    Utility.appendChildren(this.buttonsContainer, [this.confirmationButton, this.cancelationButton]);
    this.background.appendChild(this.popup);
  }

  createEventListeners() {
    this.confirmationButton.addEventListener('click', this.confirm.bind(this));
    this.cancelationButton.addEventListener('click', this.cancel.bind(this));
  }

  appendPopupTo(parent) {
    parent.appendChild(this.background);
  }

  getPromise() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  confirm() {
    this.resolve();
    state.isDeletePopupOpen = false;
    this.deletePopup();
  }

  cancel() {
    this.reject();
    state.isDeletePopupOpen = false;
    this.deletePopup();
  }

  deletePopup() {
    Utility.remove(this.background);
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
    this.createUI(this.content);
    this.appendDownloadManagerTo(document.body);


    this.downloadBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      this.createTxtFile(this.textContent)
    });
  }

  createUI(textContent) {
    this.background = Utility.createHTML(`<div class="download-manager-background"></div>`);
    this.downloadManager = Utility.createHTML(`<div class="download-manager"></div>`);
    this.title = Utility.createHTML(`<h2 class="download-manager__title">Download</h2>`);
    this.fileName = Utility.createHTML(`<p class="download-manager__file-name" contenteditable="true">To-Do</p>`)
    this.content = Utility.createHTML(`<pre class="download-manager__content" contenteditable="true">${textContent}</pre>`);
    this.dialogBox = Utility.createHTML(`<div class="download-manager__dialog-box"></div>`);
    this.downloadBtn = Utility.createHTML(`<a class="dialog-box__btn dialog-box__btn--download">Download</a>`);
    this.cancelBtn = Utility.createHTML(`<button class="dialog-box__btn dialog-box__btn--cancel">Cancel</button>`);
    this.background.appendChild(this.downloadManager);
    Utility.appendChildren(this.downloadManager, [this.title, this.fileName, this.content, this.dialogBox]);
    Utility.appendChildren(this.dialogBox, [this.downloadBtn, this.cancelBtn]);
  }

  appendDownloadManagerTo(parent) {
    parent.appendChild(this.background);
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
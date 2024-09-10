import Utility from "../main.js";

const addButton = document.querySelector('.add-note-button');
const notesContainer = document.querySelector('.notes-container');

let isNoteCreatorOpen = false;

class NoteCreator {
  constructor() {
    if (isNoteCreatorOpen) {
      console.log('You already have the note creator on.');
      return;
    }
    isNoteCreatorOpen = true;

    this.body = Utility.createHTML(`
      <div class="popup"></div>  
    `);
    this.textArea = Utility.createHTML(`
      <textarea class="note-creator__text-area"></textarea>  
    `);
    this.confirmBtn = Utility.createHTML(`
      <button class="note-creator__button note-creator__button--confirm">Confirm</button> 
    `);
    this.cancelBtn = Utility.createHTML(`
      <button class="note-creator__button note-creator__button--cancel">Cancel</button> 
    `);

    Utility.appendChildren(this.body, [
        this.textArea,
        this.confirmBtn,
        this.cancelBtn
      ]
    );
    document.body.appendChild(this.body);

    this.confirmBtn.addEventListener('click', this.createNote.bind(this));
    this.cancelBtn.addEventListener('click', this.cancel.bind(this));
  };
  createNote() {
    const noteContent = this.textArea.value;
    console.log(noteContent);
    console.log('Note has been created.');
    this.delete();
  };
  cancel() {
    console.log('Creating note has been canceled.');
    this.delete();
  };
  delete() {
    Utility.remove(this.body);
    isNoteCreatorOpen = false;
    delete this;
  };
};

class Note {
  constructor(title ,content) {
    this.note = Utility.createHTML(`
      <div class="note"></div>
    `);
    this.toolbar = Utility.createHTML(`
      <div class="note__toolbar"></div>
    `);
    this.title = Utility.createHTML(`
      <h3 class="toolbar__title">${title}<h3>
    `);
    this.BtnsBox = Utility.createHTML(`
      <div class="toolbar__btns-box"></div>
    `);
    this.optionsMenuBtn = Utility.createHTML(`
      <button class="btns-box__btn btns-box__btn--options-menu-btn">
        <svg class="btns-box__btn--options-menu-btn__icon">
          <use href="#more-options" />
        </svg>
      </button>  
    `)
    this.editBtn = Utility.createHTML(`
      <button class="btns-box__btn btns-box__btn--edit btns-box__btn--hidden">Edit</button>
    `);
    this.deleteBtn = Utility.createHTML(`
      <button class="btns-box__btn btns-box__btn--delete btns-box__btn--hidden">Delete</button>
    `);
    this.contentBox = Utility.createHTML(`
      <div class="note__content-box"></div>
    `);
    this.content = Utility.createHTML(`
      <p class="content-box__content">${content}</p>
    `);
    
    Utility.appendChildren(this.toolbar, [
      this.title,
      this.BtnsBox
    ])
    Utility.appendChildren(this.BtnsBox, [
        this.optionsMenuBtn,
        this.editBtn,
        this.deleteBtn
    ]);
    Utility.appendChildren(this.contentBox, [
      this.content
    ]);
    Utility.appendChildren(this.note, [
      this.toolbar,
      this.contentBox
    ]);
    notesContainer.appendChild(this.note);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  addButton.addEventListener('click', () => { new NoteCreator() });
  new Note('this is a title', 'and this is a text area well that what it should be you know. and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.')
  new Note('this is a title', 'and this is a text area well that what it should be you know. and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.')
  new Note('this is a title', 'and this is a text area well that what it should be you know. and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.')
  new Note('this is a title', 'and this is a text area well that what it should be you know. and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.')
  new Note('this is a title', 'and this is a text area well that what it should be you know. and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.')
  new Note('this is a title', 'and this is a text area well that what it should be you know. and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.')
  new Note('this is a title', 'and this is a text area well that what it should be you know. and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.')
  new Note('this is a title', 'and this is a text area well that what it should be you know. and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.')
  new Note('this is a title', 'and this is a text area well that what it should be you know. and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.and this is a text area well that what it should be you know.')
});
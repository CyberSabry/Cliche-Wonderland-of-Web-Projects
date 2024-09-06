import Utility from "../main.js";

const addButton = document.querySelector('.make-note-button');

let isNoteCreatorOpen = false;

class NoteCreator {
  constructor() {
    if (isNoteCreatorOpen) {
      console.log('You already have the note creator on.');
      return;
    }
    isNoteCreatorOpen = true;

    this.body = Utility.createHTML(`
      <div class="note-creator"></div>  
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

document.addEventListener('DOMContentLoaded', () => {
  addButton.addEventListener('click', () => { new NoteCreator() });
});
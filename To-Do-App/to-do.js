import Utility from "../main.js";

const textInput = document.querySelector('.text-input');
const addButton = document.querySelector('.add-button');
const downloadButton = document.querySelector('.download-button');
const downloadButtonAnchor = document.querySelector('.download-button__anchor')
const listContainer = document.querySelector('.container');
const list = document.querySelector('.list');
const label = document.querySelector('.label');

let listItemsCount = 0;
// The hole list item with all of it`s functions: edit and delete.
class Note {
    constructor (text) {
        this.id = this.generateID();

        this.listItem = Utility.createHTML(`
            <li id="${this.id}" class="list__item"></li>
        `)
        this.checkbox = Utility.createHTML(`
            <input type="checkbox" class="item__checkbox">
        `)
        this.paragraph = Utility.createHTML(`
            <p class="item__paragraph">${text}.</p>
        `)
        this.deleteButton = Utility.createHTML(`
            <button class="item__button item__button--delete">Delete</button>
        `)
        this.editButton = Utility.createHTML(`
            <button class="item__button item__button--edit">Edit</button>
        `)
        Utility.appendChildren(
            this.listItem,
            [
                this.checkbox,
                this.paragraph,
                this.editButton,
                this.deleteButton
            ]
        );
        list.appendChild(this.listItem);
        this.deleteButton.addEventListener('click', this.getConfirmationMassage.bind(this));
        this.editButton.addEventListener('click', this.startEditState.bind(this));
    };

    generateID() {
        return listItemsCount = listItemsCount + 1;
    };

    getNewNote() {
        return this.listItem;
    };

    startEditState() {
        const currentText = this.paragraph.textContent.trim();
        this.editorInputbox = Utility.createHTML(`
            <textarea type="text">${currentText}</textarea>
        `);
        this.confirmButton = Utility.createHTML(`
            <button class="item__button item__button--confirm">Confirm</button>    
        `);
        this.cancelButton = Utility.createHTML(`
            <button class="item__button item__button--cancel">Cancel</button>    
        `);
        Utility.hide(
            this.paragraph,
            this.editButton, 
            this.deleteButton
        );
        Utility.appendChildren(
            this.listItem,
            [
                this.editorInputbox,
                this.confirmButton,
                this.cancelButton
            ]
        );
        this.editorInputbox.focus();
        this.editorInputbox.setSelectionRange(this.editorInputbox.value.length, this.editorInputbox.value.length);
        this.confirmButton.addEventListener('click', () => { this.saveEditedNote(); })
        this.cancelButton.addEventListener('click', () => { this.cancelEditState(); })
    };

    cancelEditState() {
        const oldText = this.paragraph.textContent;
        this.paragraph.textContent = oldText;
        Utility.remove(
            this.editorInputbox, 
            this.confirmButton, 
            this.cancelButton
        );
        Utility.show(
            this.paragraph, 
            this.editButton, 
            this.deleteButton
        );
    };

    saveEditedNote() {
        const newText = this.editorInputbox.value.trim();
        this.paragraph.textContent = newText;
        Utility.remove(
            this.editorInputbox, 
            this.confirmButton, 
            this.cancelButton
        );
        Utility.show(
            this.paragraph,
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
        updateUI();
        delete this;
    };
};
// A popup that waits for you to make your decision.
class ConfirmationPopup {
    constructor(note, massage) {
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
            <button>Yes</button>
        `)
        this.cancelationButton = Utility.createHTML(`
            <button>No</button>
        `)

        Utility.appendChildren(
            this.popup,
            [
                this.massage,
                this.buttonsContainer
            ]
        );
        Utility.appendChildren(
            this.buttonsContainer,
            [
                this.confirmationButton,
                this.cancelationButton
            ]
        );
        this.background.appendChild(this.popup);
        document.body.appendChild(this.background);

        this.confirmationButton.addEventListener('click', this.confirm.bind(this));
        this.cancelationButton.addEventListener('click', this.deletePopup.bind(this));
    }

    confirm() {
        this.note.deleteNote();
        this.deletePopup();
    }

    deletePopup() {
        Utility.remove(this.background);
    }
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
// Takes all the added notes and puts them in a (txt) file that you download on your computer.
function createTxtFile() {
    const allText = document.querySelectorAll('.container .item__paragraph');
    let allTextCombined = '';
    allText.forEach(text => {
        let content = text.textContent;
        content += '\n\n\n\n';
        allTextCombined += content;
    })
    const blob = new Blob([allTextCombined], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    downloadButtonAnchor.href = url;
    downloadButtonAnchor.download = 'To-Do.txt';
};
// Updates the container visibility so if we don`t have any notes inside it hides it.
function updateUI() {
    if (list.children.length > 0) {
        Utility.show(listContainer,
            downloadButton
        );
    }
    else {
        Utility.hide(listContainer,
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
    textInput.addEventListener('keydown', (event) => { if(event.key === 'Enter') { createToDoListItem(); createTxtFile(); } });
    addButton.addEventListener('click', () => { createToDoListItem(); createTxtFile();});
});
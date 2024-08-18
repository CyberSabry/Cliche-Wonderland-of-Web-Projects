const textInput = document.querySelector('.text-input');
const addButton = document.querySelector('.add');
const list = document.querySelector('.list');
const label = document.querySelector('.label');

listItemsCount = 0;

class Note {
    constructor (text) {
        this.listItem = createHTML(`
            <li id="${this.generateID()}" class="list__item"></li>
        `)
        this.listContainer = createHTML(`
            <div class="item__container"></div>
        `)
        this.checkbox = createHTML(`
            <input type="checkbox" class="item__checkbox">
        `)
        this.paragraph = createHTML(`
            <p class="item__paragraph">${text}.</p>
        `)
        this.controlsContainer = createHTML(`
            <div class="item__controls-container"></div>
        `)
        this.deleteButton = createHTML(`
            <button class="item__delete-button">Delete</button>
        `)
        this.editButton = createHTML(`
            <button class="item__edit-button">Edit</button>
        `)

        appendChildren(
            this.listContainer,
            [
                this.checkbox,
                this.paragraph
            ]
        );
        appendChildren(
            this.controlsContainer,
            [
                this.editButton,
                this.deleteButton
            ]
        );
        appendChildren(
            this.listItem,
            [
                this.listContainer,
                this.controlsContainer
            ]
        );

        list.appendChild(this.listItem);

        this.deleteButton.addEventListener('click', this.deleteNote.bind(this));
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
        this.editorInputbox = createHTML(`
            <textarea type="text">${currentText}</textarea>
        `);
        this.confirmButton = createHTML(`
            <button>Confirm</button>    
        `);
        this.cancelButton = createHTML(`
            <button>Cancel</button>    
        `);
        hide(
            this.paragraph,
            this.editButton, 
            this.deleteButton
        );
        this.listContainer.appendChild(this.editorInputbox);
        appendChildren(
            this.controlsContainer,
            [
                this.confirmButton,
                this.cancelButton
            ]
        );
        this.editorInputbox.focus();
        this.editorInputbox.setSelectionRange(this.editorInputbox.value.length, this.editorInputbox.value.length);
        inputResizable(this.editorInputbox);
        this.confirmButton.addEventListener('click', () => { this.saveEditedNote(); })
        this.cancelButton.addEventListener('click', () => { this.cancelEditState(); })
    };

    cancelEditState() {
        const oldText = this.paragraph.textContent;
        this.paragraph.textContent = oldText;
        remove(
            this.editorInputbox, 
            this.confirmButton, 
            this.cancelButton
        );
        show(
            this.paragraph, 
            this.editButton, 
            this.deleteButton
        );
    };

    saveEditedNote() {
        const newText = this.editorInputbox.value;
        this.paragraph.textContent = newText;
        remove(
            this.editorInputbox, 
            this.confirmButton, 
            this.cancelButton
        );
        show(
            this.paragraph,
            this.editButton, 
            this.deleteButton
        );
        this.listContainer.appendChild(this.paragraph);
        this.editButton.removeEventListener('click', this.startEditState.bind(this))
    };

    deleteNote() {
        this.listItem.remove();
        delete this;
    };
};
// this one should be the main function that combines them all
function createToDoListItem() {
    let isInputValid = inputValidation(textInput.value);
    let text = textInput.value
    if (isInputValid) {
        const note = new Note(text);
        note.getNewNote();
        label.innerHTML = 'Please pretend that you saw this idea for the first time and embrace it';
        resetInput(textInput);
    }
    else {
        label.innerHTML = 'Write something dude.';
    }
}

function inputValidation(input) {
    if (input === '') {
        return false;
    }
    else {
        return true;
    }
}

function createHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

function resetInput(input) {
    input.value = '';
}
// Appends one or multiple children to one parent at once so i can do that in one line.
function appendChildren(parent, children) {
    children.forEach(child => {
        parent.appendChild(child);
    })
}
// Just makes the code look nicer and understandable.
function hide(...elements) {
    elements.forEach(element => {
        element.style.display = 'none';
    })
}
// Same purpose as hideElement().
function show(...elements) {
    elements.forEach(element => {
        element.style.display = 'block';
    })
}
// I can remove one or multiple elements in one line, better than the default js method :).
function remove(...elements) {
    elements.forEach(element => {
        element.remove();
    })
}

function inputResizable(input) {
    input.addEventListener('keyup', () => {
        input.style.height = input.scrollHeight + 'px';
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (event) => { 
        if(event.key === '/') { 
            event.preventDefault(); 
            textInput.focus();
        };
    });
    textInput.addEventListener('keydown', (event) => { if(event.key === 'Enter') { createToDoListItem(); } });
    addButton.addEventListener('click', createToDoListItem);
})
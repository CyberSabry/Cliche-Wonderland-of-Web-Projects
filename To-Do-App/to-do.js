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

        this.listContainer.appendChild(this.checkbox);
        this.listContainer.appendChild(this.paragraph);

        this.controlsContainer.appendChild(this.editButton);
        this.controlsContainer.appendChild(this.deleteButton);

        this.listItem.appendChild(this.listContainer);
        this.listItem.appendChild(this.controlsContainer);

        list.appendChild(this.listItem);

        this.deleteButton.addEventListener('click', this.deleteNote.bind(this))
        this.editButton.addEventListener('click', this.editNote.bind(this))
    }

    generateID() {
        return listItemsCount = listItemsCount + 1;
    }

    getNewNote() {
        return this.listItem;
    }

    editNote() {
        let currentText = this.paragraph.textContent;
        let editorInputbox = createHTML(`
            <input type="text" value="${currentText}">
        `)
        this.paragraph.remove();
        this.listContainer.appendChild(editorInputbox);
        editorInputbox.focus();
        editorInputbox.setSelectionRange(editorInputbox.value.length, editorInputbox.value.length);
        editorInputbox.addEventListener('keydown', (event) => {
            if (event.key === 'Enter')
            this.saveEditedNote(editorInputbox);
        })
    }

    saveEditedNote(editorInputbox) {
        let newText = editorInputbox.value;
        this.paragraph = createHTML(`
            <p class="item__paragraph">${newText}.</p>    
        `)
        editorInputbox.remove();
        this.listContainer.appendChild(this.paragraph);
    }

    deleteNote() {
        this.listItem.remove();
        delete this;
    }
};

// this one should be the main function that combines them all
function createToDoListItem() {
    let isInputValid = inputValidation(textInput.value);
    let text = textInput.value
    if (isInputValid) {
        const note = new Note(text);
        note.getNewNote();
        // editButton.addEventListener('click', editListItem)
        // deleteButton.addEventListener('click', deleteListItem)
        // label.innerHTML = 'Please pretend that you saw this idea for the first time and embrace it';
        // resetInput(textInput);
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

document.addEventListener('DOMContentLoaded', () => {
    addButton.addEventListener('click', createToDoListItem);
})
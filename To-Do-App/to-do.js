const textInput = document.querySelector('.text-input');
const addButton = document.querySelector('.add');
const list = document.querySelector('.list');
const label = document.querySelector('.label');

this.listItemsCount = 0;

class Note {
    constructor (text) {
        this.listItem = createHTML(`
            <li id="${this.generateID()}" class="list__item"></li>
        `)
        this.listContaier = createHTML(`
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

        this.listContaier.appendChild(this.checkbox);
        this.listContaier.appendChild(this.paragraph);

        this.controlsContainer.appendChild(this.editButton);
        this.controlsContainer.appendChild(this.deleteButton);

        this.listItem.appendChild(this.listContaier);
        this.listItem.appendChild(this.controlsContainer);

        this.deleteButton.addEventListener('click', this.deleteNote.bind(this))
    }

    generateID() {
        return listItemsCount = listItemsCount + 1;
    }

    getNewNote() {
        return this.listItem;
    }

    deleteNote() {
        this.listItem.remove();
    }
};

// this one should be the main function that combines them all
function createToDoListItem() {
    let isInputValid = inputValidation(textInput.value);
    let text = textInput.value
    if (isInputValid) {
        const note = new Note(text);
        list.appendChild(note.getNewNote());
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

function editListItem(event) {
    let target = event.target;
    let listItemID = target.parentNode.id;
    let listItem = document.getElementById(listItemID);
    let itemTextParagraph = listItem.getElementsByTagName('p')[0];
    let textParagraphContent = itemTextParagraph.textContent;
    let container = listItem.getElementsByClassName('item__container')[0];
    console.log(container)
    let newInput = createHTML(`
        <input type="text" value="${textParagraphContent}">
    `)
    itemTextParagraph.remove();
    container.appendChild(newInput);
    newInput.focus();
    newInput.setSelectionRange(newInput.value.length, newInput.value.length);
    newInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter')
        saveEdit(newInput);
    })
}

function saveEdit(input) {
    let newContent = input.value;
    let newParagraph = createHTML(`
        <p class="item__paragraph">${newContent}</p>
    `);

    input.replaceWith(newParagraph);
}

function deleteListItem(event) {
    let target = event.target;
    target.parentNode.remove();
}

document.addEventListener('DOMContentLoaded', () => {
    addButton.addEventListener('click', createToDoListItem);
})
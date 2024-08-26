const textInput = document.querySelector('.text-input');
const addButton = document.querySelector('.add');
const listContainer = document.querySelector('.container');
const list = document.querySelector('.list');
const label = document.querySelector('.label');

listItemsCount = 0;
// The hole list item with all of it`s functions: edit and delete.
class Note {
    constructor (text) {
        this.id = this.generateID();

        this.listItem = createHTML(`
            <li id="${this.id}" class="list__item"></li>
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
        const newText = this.editorInputbox.value.trim();
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
        if (newText === '') {
            this.deleteNote();
        }
        else {
            this.listContainer.appendChild(this.paragraph);
        }
        updateContainerVisibility();
    };

    getConfirmationMassage() {
        new ConfirmationPopup(this, 'Are you sure you want to delete this note?');
    };

    deleteNote() {
        this.listItem.remove();
        updateContainerVisibility();
        delete this;
    };
};
// A popup that waits for you to make your decision.
class ConfirmationPopup {
    constructor(note, massage) {
        this.note = note;

        this.background = createHTML(`
            <div class="popup-background"></div>    
        `)
        this.popup = createHTML(`
            <div class="popup"></div>
        `)
        this.massage = createHTML(`
            <p class="popup__massage">${massage}</p>        
        `)
        this.buttonsContainer = createHTML(`
            <div class="popup__controls-container"></div>     
        `)
        this.confirmationButton = createHTML(`
            <button>Yes</button>
        `)
        this.cancelationButton = createHTML(`
            <button>No</button>
        `)

        appendChildren(
            this.popup,
            [
                this.massage,
                this.buttonsContainer
            ]
        );
        appendChildren(
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
        remove(this.background);
    }
}
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
        resetInput(textInput);
        updateContainerVisibility();
    }
}
// Checks if the input is empty it returns true and if its not empty its false.
function checkEmptyInput(input) {
    if (input === '') {
        return true;
    }
    else {
        return false;
    }
}
createTxtFile(`
    hey i'm a text yay
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequuntur laudantium asperiores ex error quas praesentium assumenda facere id tempora a repellat earum eligendi tempore atque dicta molestiae veritatis doloribus deserunt vitae aut natus esse, vel ullam. Voluptatibus rerum, eaque tempore doloremque tenetur sapiente quos. Ad enim voluptatem error voluptates vel modi, incidunt possimus nihil doloribus voluptate perferendis quas aliquid? Molestiae repellendus voluptates et impedit accusamus saepe, iusto temporibus? Iusto corporis enim vero dolores facere voluptate inventore? Animi repellendus sequi rem placeat cupiditate a ab, fugit tempora fuga commodi et nobis laborum dolores veniam repellat assumenda sint dolor ducimus. Modi, dolorum.    
`)
function createTxtFile(text) {
    const button = document.querySelector('.download');
    const blob = new Blob([text], {type: 'text/plain'});

    const url = URL.createObjectURL(blob);
    button.href = url;
    button.download = 'wow you have a file!.txt';

}
// Creates HTML elements just like if you were doing it in a HTML file.
function createHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}
// Sets any input value you want to an empty string.
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
// Updates the container visibility so if we don`t have any notes inside it hides it.
function updateContainerVisibility() {
    if (list.children.length > 0) {
        show(listContainer);
    }
    else {
        hide(listContainer);
    }
}
// Makes the text area resize itself depending on how much contenet it has.
function inputResizable(input) {
    const lostPixels = 4;
    input.style.height = (input.scrollHeight + lostPixels) + 'px';
    input.addEventListener('keyup', () => {
        input.style.height = (input.scrollHeight + lostPixels) + 'px';
    })
}
// Stuff happens when you first load the page!.
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
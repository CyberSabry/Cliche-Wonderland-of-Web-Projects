const textInput = document.querySelector('.text-input');
const addButton = document.querySelector('.add');
const listContainer = document.querySelector('.list');
const label = document.querySelector('.label');

const listItemsCount = 0;
// this one should be the main function that combines them all
function createToDoListItem() {
    let isInputValid = inputValidation(textInput.value);
    let text = textInput.value
    if (isInputValid) {
        let listItem = createElement('li', text, listContainer, 'list__item');
        let deleteButton = createElement('button', 'Delete', listItem, 'item__delete-button');
        label.innerHTML = 'Please pretend that you saw this idea for the first time and embrace it';
        deleteButton.addEventListener('click', deleteListItem);
    }
    else {
        label.innerHTML = 'Write something dude.';
    }
}
// So this one just so i can create any element in one line
function createElement(type, text, parentElement, className) {
    let element = document.createElement(type);
    element.classList.add(className);
    element.innerHTML = text;
    parentElement.appendChild(element);
    return element;
}

function inputValidation(input) {
    if (input === '') {
        return false;
    }
    else {
        return true;
    }
}

function deleteListItem(event) {
    let target = event.target;
    target.parentNode.remove();
}

document.addEventListener('DOMContentLoaded', () => {
    addButton.addEventListener('click', createToDoListItem);
})
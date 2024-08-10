const textInput = document.querySelector('.text-input');
const addButton = document.querySelector('.add');
const list = document.querySelector('.list');
const label = document.querySelector('.label');

let listItemsCount = 0;
// this one should be the main function that combines them all
function createToDoListItem() {
    let isInputValid = inputValidation(textInput.value);
    let text = textInput.value
    if (isInputValid) {
        label.innerHTML = 'Please pretend that you saw this idea for the first time and embrace it';
        let listItem = createListItem();
        let checkbox = createCheckbox();
        let itemText = createListText(text);
        let delteButton = createDeleteButton();
        list.appendChild(listItem);
        listItem.appendChild(checkbox);
        listItem.appendChild(itemText);
        listItem.appendChild(delteButton);
    }
    else {
        label.innerHTML = 'Write something dude.';
    }
}

function generateID() {
    return listItemsCount = listItemsCount + 1;
}

function createCheckbox() {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    return checkbox;
}

function createListItem() {
    const className = 'list__item';
    let element = document.createElement('li');
    element.id = generateID();
    element.classList.add(className);
    return element;
}

function createListText(content) {
    let text = document.createElement('p');
    text.innerHTML = content;
    return text;
}

function createDeleteButton() {
    const className = 'item__delete-button';
    let button = document.createElement('button');
    button.classList.add(className);
    button.innerHTML = 'Delete';
    button.addEventListener('click', deleteListItem);
    return button;
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
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
        const item = createHTML(`
            <li id="${generateID()}" class="list__item">
                <div class="item__container">
                    <input type="checkbox" class="item__checkbox">
                    <p class="item__paragraph">${text}</p>
                </div>
            </li>
        `);
        const editButton = createHTML(`
            <button class="item__edit-button">Edit</button>    
        `)
        const deleteButton = createHTML(`
            <button class="item__delete-button">Delete</button>
        `)
        item.appendChild(editButton)
        item.appendChild(deleteButton);
        list.appendChild(item);
        editButton.addEventListener('click', editListItem)
        deleteButton.addEventListener('click', deleteListItem)
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

function generateID() {
    return listItemsCount = listItemsCount + 1;
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
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
        const deleteButton = createHTML(`
            <button class="item__delete-button">Delete</button>
        `)
        item.appendChild(deleteButton);
        list.appendChild(item);
        deleteButton.addEventListener('click', deleteListItem)
        label.innerHTML = 'Please pretend that you saw this idea for the first time and embrace it';
    }
    else {
        label.innerHTML = 'Write something dude.';
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
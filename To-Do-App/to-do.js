const userInput = document.querySelector('#to-do-input');
const addButton = document.querySelector('#add');
const listContainer = document.querySelector('#to-do-list');



function createToDoListItem() {

    let text = userInput.value
    let item = document.createElement('li');
    listContainer.appendChild(item);
    item.innerHTML = text;
}

document.addEventListener('DOMContentLoaded', () => {

    addButton.onclick = createToDoListItem;
})
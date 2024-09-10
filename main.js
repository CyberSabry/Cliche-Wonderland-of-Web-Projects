// Utility functions:
// Creates HTML elements just like if you were doing it in a HTML file.
function createHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
};
// Sets any input value you want to an empty string.
function resetInput(input) {
    input.value = '';
};
// Appends one or multiple children to one parent at once so i can do that in one line.
function appendChildren(parent, children) {
    children.forEach(child => {
        parent.appendChild(child);
    })
};
// Just makes the code look nicer and understandable.
function hide(...elements) {
    elements.forEach(element => {
        const className = element.classList[0];
        element.classList.add(className + '--hidden');
    })
};
// Same purpose as hideElement().
function show(...elements) {
    elements.forEach(element => {
        const className = element.classList[0];
        element.classList.remove(className + '--hidden');
    })
};
// I can remove one or multiple elements in one line, better than the default js method :).
function remove(...elements) {
    elements.forEach(element => {
        element.remove();
    })
};
// Moves the cursor to the end of editable text element.
function placeCursorAtEnd(element) {
    let range = document.createRange();
    let selection = window.getSelection();

    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}


const colorToggleButton = document.querySelector('.toggle-color-mode-button');

let isDarkMode;
let currentMode;

const CSSColorVariables = [
    '--primery-clr',
    '--primery-low-op-clr',
    '--secondary-clr',
    '--link-clr',
    '--hover-clr',
    '--click-clr',
    '--focus-clr',
    '--border-clr'
];
const lightMode = {
    primery: 'hsl(0, 0%, 100%)',
    primeryLowOpacity: 'hsla(0, 0%, 100%, 0.5)',
    secondary: 'hsl(0, 0%, 0%)',
    link: 'hsl(225, 100%, 50%)',
    hover: 'hsl(200, 100%, 50%)',
    click: 'hsl(225, 100%, 50%)',
    focus: 'hsl(225, 100%, 50%)',
    border: 'hsl(0, 0%, 0%)'
};
const darkMode = {
    primery: 'hsl(0, 0%, 10%)',
    primeryLowOpacity: 'hsla(0, 0%, 10%, 0.5)',
    secondary: 'hsl(0, 0%, 60%)',
    link: 'hsl(225, 100%, 35%)',
    hover: 'hsl(200, 100%, 40%)',
    click: 'hsl(225, 100%, 30%)',
    focus: 'hsl(225, 100%, 30%)',
    border: 'hsl(0, 0%, 40%)'
};
// Applies all the values of a theme object to all CSS variables, careful the order of values matters.
function setTheme(theme) {
    const values = Object.values(theme);
    const root = document.documentElement;
    // for ( let i = 0; i < CSSColorVariables.length; i++ ) {
    //     root.style.setProperty(CSSColorVariables[i], values[i]);
    // }
};
// When we first load the page it checks the user's device prefrence and set the theme according to that...
// ...and then changes the text content of the switching button.
function setUp() {
    isDarkMode = detectUserColorMode();

    if(isDarkMode) {
        setTheme(darkMode);
        colorToggleButton.textContent = 'Light Mode';
        currentMode = 'dark';
    }
    else {
        setTheme(lightMode);
        colorToggleButton.textContent = 'Dark Mode';
        currentMode = 'light';
    }
};
// Checks what mode we are currently in and then work according to that.
function switchThemes() {
    if (currentMode === 'dark') {
        setTheme(lightMode);
        colorToggleButton.textContent = 'Dark Mode';
        currentMode = 'light'
    }
    else if (currentMode === 'light') {
        setTheme(darkMode);
        colorToggleButton.textContent = 'Light Mode';
        currentMode = 'dark'
    }
};
function detectUserColorMode() {
    const result = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode = result;
};
document.addEventListener('DOMContentLoaded', () => {
    setUp();
    colorToggleButton.addEventListener('click', switchThemes);
});

export default { createHTML, resetInput, appendChildren, hide, show, remove, placeCursorAtEnd };
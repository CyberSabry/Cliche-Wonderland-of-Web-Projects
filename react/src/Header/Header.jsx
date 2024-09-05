import React, { useState, useEffect } from "react"
import styles from "./Header.module.css"

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
  secondary: 'hsl(0, 0%, 80%)',
  link: 'hsl(225, 100%, 35%)',
  hover: 'hsl(200, 100%, 40%)',
  click: 'hsl(225, 100%, 30%)',
  focus: 'hsl(225, 100%, 30%)',
  border: 'hsl(0, 0%, 60%)'
};
// Applies all the values of a theme object to all CSS variables, careful the order of values matters.
function setTheme(theme) {
  const values = Object.values(theme);
  const root = document.documentElement;
  for ( let i = 0; i < CSSColorVariables.length; i++ ) {
    root.style.setProperty(CSSColorVariables[i], values[i]);
  }
}

function Header() {
  const [textContent, setTextContent] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentMode, setCurrentMode] = useState("");
  // When we first load the page it checks the user's device prefrence and set the theme according to that...
  // ...and then changes the text content of the switching button.
  function setUp(darkModePreferred) {
    setIsDarkMode(darkModePreferred);
    if(isDarkMode) {
      console.log('its dark');
      setTheme(darkMode);
      setTextContent('Light Mode');
      ;
    }
    else {
      console.log('its light');
      setTheme(lightMode);
      setTextContent('Dark Mode');
      setCurrentMode('light');
    }
  };
  // Checks what mode we are currently in and then work according to that.
  function switchThemes() {
    if (currentMode === 'dark') {
      setTheme(lightMode);
      setTextContent('Dark Mode');
      setCurrentMode('light');
    }
    else if (currentMode === 'light') {
      setTheme(darkMode);
      setTextContent('Light Mode');
      setCurrentMode('dark');
    }
  };

  useEffect(() => {
    const darkModePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(darkModePreferred);
    if(isDarkMode) {
      console.log('its dark');
      setTheme(darkMode);
      setTextContent('Light Mode');
      ;
    }
    else {
      console.log('its light');
      setTheme(lightMode);
      setTextContent('Dark Mode');
      setCurrentMode('light');
    }
  }, []);

  return(
    <header className={styles.header}>
      <h1 className={styles.h1}>Cliché Wonderland of Web Projects</h1>
      <button className={styles.colorModeButton} onClick={switchThemes}>{textContent}</button>
    </header>
  );
}

export default Header
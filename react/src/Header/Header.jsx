import styles from "./Header.module.css"

function Header() {
  return(
    <header className={styles.header}>
      <h1 className={styles.h1}>Cliché Wonderland of Web Projects</h1>
      <button class={styles.colorModeButton}>Dark Mode (doesn't work yet)</button>
    </header>
  );
}

export default Header
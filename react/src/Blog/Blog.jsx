import styles from "./Blog.module.css"

function Blog() {
  return(
    <main className={styles.blog}>
      <h2>Behold! The Cliché Projects That Everyone Makes!, let's dive into the wonderland of predictable projects!</h2>
      <p>Hello, fellow web enthusiasts! I`m a beginner in web development, and like any good novice, I`ve decided to tackle the most overdone, unimaginative projects out there.</p>
      <p>In this corner of the internet, you`ll find all the classics: to-do lists, weather apps, calculators, and maybe even a fancy little blog that nobody will read. I`m here to practice my JavaScript skills by creating every cliché project I can find, but with a twist, my own twist. Because if you can`t be original, at least be entertaining.</p>
      <p>So, grab some popcorn, sit back, and enjoy this ride through the land of mundane yet essential web projects. It`s not groundbreaking, but hey, we all have to start somewhere.</p>
      
      <hr className={styles.breakout} />
      
      <h3>To-Do app</h3>
      <p className={`${styles.callToAction} ${styles.breakout}`}>Guess what my first one is? That's right it's a <a href="/To-Do-App/to-do.html">To-Do app</a>!. Because why the fuck not.</p>

      <hr className={styles.breakout} />
      <h3>Notes app</h3>
      <p className={`${styles.callToAction} ${styles.breakout}`}>Well i bet you didn't see this one coming. I know <a href="/Notes-App/notes.html">Notes app</a> is similer to the previous one but i think it has alot of differences that desurves to be a stand alone app.</p>
    </main>
  );
}

export default Blog
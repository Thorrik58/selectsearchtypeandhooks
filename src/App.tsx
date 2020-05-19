import React from "react";
import logo from "./logo.svg";
import styles from "./App.module.scss";

function App() {
  return (
    <div className="App">
      <header className={styles.app_header}>
        <img src={logo} className={styles.app_logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className={styles.app_link}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

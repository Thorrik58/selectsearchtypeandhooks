import React from "react";
import logo from "./logo.svg";
import styles from "./App.module.scss";
import Select from "./Components/Select/Select";

function App() {
  return (
    <div className="App">
      <header className={styles.app_header}>
        <Select />
      </header>
    </div>
  );
}

export default App;

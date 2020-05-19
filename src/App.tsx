import React from "react";
import styles from "./App.module.scss";
import Select from "./Components/Select/Select";

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.app_header}>
        <Select />
      </header>
    </div>
  );
}

export default App;

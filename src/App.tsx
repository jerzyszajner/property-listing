import { Outlet } from "react-router-dom";

import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.appContainer}>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;

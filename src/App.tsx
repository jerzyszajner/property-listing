import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./App.module.css";
function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className={styles.app}>
        <Outlet />
      </main>
    </>
  );
}

export default App;

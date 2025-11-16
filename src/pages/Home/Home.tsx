import HomeHeader from "./components/HomeHeader/HomeHeader";
import AISearchBar from "./components/AISearchBar/AISearchBar";
import styles from "./Home.module.css";

/* Home page */
const Home = () => {
  return (
    <div className={styles.home}>
      <HomeHeader />
      <AISearchBar />
    </div>
  );
};

export default Home;

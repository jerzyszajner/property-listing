import HomeHeader from "./components/HomeHeader/HomeHeader";
import AISearchBar from "./components/AISearchBar/AISearchBar";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import styles from "./Home.module.css";

/* Home page */
const Home = () => {
  return (
    <div className={styles.home}>
      <HomeHeader />
      <AISearchBar />
      <HowItWorks />
    </div>
  );
};

export default Home;

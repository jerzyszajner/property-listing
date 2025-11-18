import HomeHeader from "./components/HomeHeader/HomeHeader";
import AISearchBar from "./components/AISearchBar/AISearchBar";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import FeaturedProperties from "./components/FeaturedProperties/FeaturedProperties";
import styles from "./Home.module.css";

/* Home page */
const Home = () => {
  return (
    <div className={styles.home}>
      <HomeHeader />
      <AISearchBar />
      <HowItWorks />
      <FeaturedProperties />
    </div>
  );
};

export default Home;

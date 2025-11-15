import HomeHeader from "./components/HomeHeader/HomeHeader";
import styles from "./Home.module.css";

/* Home page */
const Home = () => {
  return (
    <div className={styles.home}>
      <HomeHeader />
    </div>
  );
};

export default Home;

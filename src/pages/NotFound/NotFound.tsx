import { Link } from "react-router-dom";
import notFoundImage from "@/assets/images/not-found.webp";
import styles from "./NotFound.module.css";

/* Not found page */
const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.wrapper}>
        <img src={notFoundImage} alt="Not Found" className={styles.image} />
        <Link to="/" className={styles.link}>
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

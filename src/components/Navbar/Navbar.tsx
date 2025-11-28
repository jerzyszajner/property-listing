import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import clsx from "clsx";
import logo from "@/assets/icons/logo.svg";
import Divider from "../Divider/Divider";
import { MAIN_LINKS, AUTHENTICATED_LINKS, AUTH_LINK } from "./navbarConfig";
import { useMenu } from "./hooks/useMenu";
import { useAuthContext } from "@/contexts/AuthContext";
import styles from "./Navbar.module.css";

/* Navbar component */
const Navbar = () => {
  const { isOpen, toggleMenu, closeMenu } = useMenu();
  const { user, signOut, isLoading } = useAuthContext();
  const isLoggedIn = user !== null;

  const navigate = useNavigate();

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
    navigate("sign-in");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* === Logo === */}
        <Link to="/" className={styles.logoLink} onClick={closeMenu}>
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </Link>

        {/* === Main Navigation === */}
        <ul className={styles.links}>
          {/* Map MAIN_LINKS (Home, Properties, About, Contact) */}
          {MAIN_LINKS.map((link) => (
            <li className={styles.linkItem} key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  clsx(styles.link, isActive && styles.active)
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* === Hamburger Button === */}
        <button
          onClick={toggleMenu}
          className={styles.hamburgerButton}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className={styles.hamburgerIcon} />
          ) : (
            <Menu className={styles.hamburgerIcon} />
          )}
        </button>

        {/* === Sidebar Menu === */}
        {isOpen && (
          <>
            <div className={styles.overlay} onClick={closeMenu}></div>
            <aside className={styles.sidebar}>
              {/* === Sidebar Header === */}
              <div className={styles.sidebarHeader}>
                <Link to="/" className={styles.logoLink} onClick={closeMenu}>
                  <img src={logo} alt="Logo" className={styles.logoImage} />
                </Link>
              </div>

              {/* === Sidebar Navigation === */}
              <nav className={styles.sidebarNav}>
                {/* === Main Links === */}
                <ul className={styles.sidebarMainLinks}>
                  {/* Map MAIN_LINKS (Home, Properties, About, Contact) */}
                  {MAIN_LINKS.map((link) => (
                    <li className={styles.sidebarItem} key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          clsx(styles.sidebarLink, isActive && styles.active)
                        }
                        onClick={closeMenu}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                {/* === User Links === */}
                {isLoggedIn ? (
                  <>
                    <Divider variant="muted" />
                    <ul className={styles.sidebarUserLinks}>
                      {/* Map AUTHENTICATED_LINKS (My Bookings, Profile) */}
                      {AUTHENTICATED_LINKS.map((link) => (
                        <li className={styles.sidebarItem} key={link.to}>
                          <NavLink
                            to={link.to}
                            className={({ isActive }) =>
                              clsx(
                                styles.sidebarLink,
                                isActive && styles.active
                              )
                            }
                            onClick={closeMenu}
                          >
                            {link.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                    <Divider variant="muted" />
                    <button
                      className={styles.sidebarLogout}
                      onClick={handleSignOut}
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing out..." : "Sign Out"}
                      <LogOut className={styles.icon} />
                    </button>
                  </>
                ) : (
                  <>
                    <Divider variant="muted" />
                    <ul className={styles.sidebarUserLinks}>
                      {/* Map AUTH_LINK (Sign In) */}
                      {AUTH_LINK.map((link) => (
                        <li className={styles.sidebarItem} key={link.to}>
                          <NavLink
                            to={link.to}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                              clsx(
                                styles.sidebarLink,
                                isActive && styles.active
                              )
                            }
                          >
                            {link.label}
                            <LogIn className={styles.icon} />
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </nav>
            </aside>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

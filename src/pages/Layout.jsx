import { Link, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className={`p-4 ${styles.header}`}>
        <nav className="flex gap-4">
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/monsters" className={styles.navLink}>Monsters</Link>
          <Link to="/spells" className={styles.navLink}>Spells</Link>
        </nav>
      </header>
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { Settings, LogIn, LogOut } from "lucide-react";
import { SourcesProvider } from "../context/SourcesContext";
import { AuthProvider } from "../context/AuthContext";
import { useSources } from "../helpers/useSources";
import { useAuth } from "../helpers/useAuth";
import { signInWithGoogle, signOut } from "../services/authService";
import SourcesModal from "../components/SourcesModal";
import styles from "./Layout.module.css";

function HeaderControls() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { selectedSources, setSelectedSources } = useSources();
  const { user, isLoading } = useAuth();

  return (
    <>
      {!isLoading &&
        (user ? (
          <div className={`flex items-center gap-2 ${styles.authArea}`}>
            <span className={styles.userName}>
              Signed in as <strong>{user.displayName || user.email}</strong>
            </span>
            <button
              type="button"
              onClick={signOut}
              className={styles.gearBtn}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={signInWithGoogle}
            className={`flex items-center gap-1.5 ${styles.signInBtn}`}
            title="Sign in with Google"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        ))}
      <button
        type="button"
        onClick={() => setIsSettingsOpen(true)}
        className={styles.gearBtn}
        aria-label="Source Settings"
        title="Source Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
      {isSettingsOpen && (
        <SourcesModal
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
}

function Layout() {
  return (
    <AuthProvider>
      <SourcesProvider>
        <div className="min-h-screen flex flex-col">
          <header className={`p-4 ${styles.header}`}>
            <nav className="flex items-center gap-4">
              <Link to="/" className={styles.navLink}>
                Home
              </Link>
              <div className="flex items-center gap-4 border-l-1 pl-4">
                <Link to="/monsters" className={styles.navLink}>
                  Monsters
                </Link>
                <Link to="/spells" className={styles.navLink}>
                  Spells
                </Link>
              </div>
              <div className="flex items-center gap-4 border-l-1 pl-4">
                <Link to="/characters" className={styles.navLink}>
                  Characters
                </Link>
                <Link to="/parties" className={styles.navLink}>
                  Parties
                </Link>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <HeaderControls />
              </div>
            </nav>
          </header>
          <main className="h-full">
            <Outlet />
          </main>
        </div>
      </SourcesProvider>
    </AuthProvider>
  );
}

export default Layout;

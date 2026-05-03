import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { Settings } from "lucide-react";
import { SourcesProvider } from "../context/SourcesContext";
import { useSources } from "../helpers/useSources";
import SourcesModal from "../components/SourcesModal";
import styles from "./Layout.module.css";

function HeaderControls() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { selectedSources, setSelectedSources } = useSources();

  return (
    <>
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
    <SourcesProvider>
      <div className="min-h-screen flex flex-col">
        <header className={`p-4 ${styles.header}`}>
          <nav className="flex items-center gap-4">
            <Link to="/" className={styles.navLink}>
              Home
            </Link>
            <Link to="/monsters" className={styles.navLink}>
              Monsters
            </Link>
            <Link to="/spells" className={styles.navLink}>
              Spells
            </Link>
            <div className="ml-auto">
              <HeaderControls />
            </div>
          </nav>
        </header>
        <main className="h-full">
          <Outlet />
        </main>
      </div>
    </SourcesProvider>
  );
}

export default Layout;

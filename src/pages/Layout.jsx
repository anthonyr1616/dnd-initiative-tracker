import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <nav style={{ display: "inline-block" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>
            Home
          </Link>
          <Link to="/monsters" style={{ marginRight: "1rem" }}>
            Monsters
          </Link>
          <Link to="/spells">Spells</Link>
        </nav>
      </header>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-slate-500 text-white">
        <nav className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/monsters">Monsters</Link>
          <Link to="/spells">Spells</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

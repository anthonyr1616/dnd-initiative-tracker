import { Link, Outlet  } from "react-router-dom";

const SpellInfoPage = () => {
  return (
    <nav>
      <ul>
        <li>
          <div>SPELLS!!</div>
        </li>
      </ul>
        <Outlet />
    </nav>
  );
};

export default SpellInfoPage;

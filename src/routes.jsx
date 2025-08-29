import Layout from "./pages/Layout";
import App from "./App";
import MonsterInfoPage from "./pages/MonsterInfoPage";
import SpellInfoPage from "./pages/SpellInfoPage";
import ErrorPage from "./pages/ErrorPage";

const routes = [
  {
    path: "/",
    element: <Layout />, // layout wraps all routes
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "monsters",
        element: <MonsterInfoPage />,
      },
      {
        path: "spells",
        element: <SpellInfoPage />,
      },
    ],
  },
];

export default routes;

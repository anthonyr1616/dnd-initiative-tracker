import Layout from "./pages/Layout";
import App from "./App";
import MonsterInfoPage from "./pages/MonsterInfoPage";
import SpellInfoPage from "./pages/SpellInfoPage";
import ErrorPage from "./pages/ErrorPage";
import ViewerPage from "./pages/ViewerPage";

const routes = [
  {
    path: "/",
    element: <Layout />, // layout wraps all child routes
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
  {
    path: "/room/:id",
    element: <ViewerPage />,
    errorElement: <ErrorPage />,
  },
];

export default routes;

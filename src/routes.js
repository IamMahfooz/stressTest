import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./components/authenticated/login";
import Stresstest from "./components/authenticated/stresstest";
import Status from "./components/status";
import Problems from "./components/unauthenticated/problems";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            // errorElement: <ErrorPage />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/status",
            element: <Status />
        },
        {
            path: "/stresstest",
            element: <Stresstest />
        },
        {
            path: "/problems",
            element: <Problems />
        }
    ]);

    return <RouterProvider router={router} />;
};

export default Router;
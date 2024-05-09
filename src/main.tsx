import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import Contact from "./pages/Contact.tsx";
import App from "./App.tsx";
import ExcelPage from "./pages/Excel.tsx";
// import Home from "./pages/Home.tsx";
import React from "react";
// import About from "./pages/About.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <ExcelPage />,
            },
            // {
            //     path: "contact",
            //     element: <Contact />,
            // },
            // {
            //     path: "excel",
            //     element: <ExcelPage />,
            // },
            // {
            //     path: "about",
            //     element: <About />,
            // },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

import { Outlet } from "react-router-dom";
// import Navbar from "./components/Navbar/Navbar";
const App = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* <Navbar /> */}
            <Outlet />
        </div>
    );
};

export default App;
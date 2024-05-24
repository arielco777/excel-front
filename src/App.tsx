import { Outlet } from "react-router-dom";
// Some Comment
const App = () => {
    return (
        <div className="flex h-screen flex-col">
            {/* <Navbar /> */}
            <Outlet />
        </div>
    );
};

export default App;

import { Outlet } from "react-router-dom";
const App = () => {
   return (
        <div className= "flex flex-col h-screen">
            {/* <Navbar /> */}
            <Outlet />
        </div>
    );
};

export default App;

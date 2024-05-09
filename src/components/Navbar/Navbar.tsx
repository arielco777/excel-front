import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="ml-56 py-2">
            <ul className="flex gap-10">
                <li className="group">
                    <NavLink to="/">
                        Home
                        <div className="border-b border-neutral-500 transition-all duration-100 w-0 group-hover:w-full" />
                    </NavLink>
                </li>
                <li className="group">
                    <NavLink to="/excel">
                        Excel
                        <div className="border-b border-neutral-500 transition-all duration-100 w-0 group-hover:w-full" />
                    </NavLink>
                </li>
                <li className="group">
                    <NavLink to="/about">
                        About{" "}
                        <div className="border-b border-neutral-500 transition-all duration-100 w-0 group-hover:w-full" />
                    </NavLink>
                </li>
                <li className="group">
                    <NavLink to="/contact">
                        Contact{" "}
                        <div className="border-b border-neutral-500 transition-all duration-100 w-0 group-hover:w-full" />
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;

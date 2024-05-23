import { useEffect, useRef, useState } from "react";

interface DropdownProps {
    disabled?: boolean;
    options: string[];
    setItem: React.Dispatch<React.SetStateAction<string>>;
}

//TODO: Finish this
const Dropdown: React.FC<DropdownProps> = ({
    disabled = false,
    options,
    setItem,
}) => {
    const [selectedItem, setSelectedItem] = useState<string>();
    const [isMenuShowing, setIsMenuShowing] = useState<boolean>(false);
    const menuRef = useRef(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
        ) {
            setIsMenuShowing(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuShowing]);

    return (
        <div className="relative w-full" ref={menuRef}>
            <div className="flex"></div>
        </div>
    );
};
export default Dropdown;

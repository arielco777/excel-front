import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../../Inputs/Dropdown";
import { Add } from "@mui/icons-material";

const equalizerList = [">", "<", ">=", "<=", "==", "!="] as const;
const params = ["addIf", "countIf", "vLoopkup"];
type Equalizer = (typeof equalizerList)[number];

interface MenuItemProp {
    param: string;
    column: string;
    equalizer: Equalizer;
    equalTo: string | number;
}

interface ParamMenuProp {
    headers: string[];
    className?: string;
}

// const equalizerName = [
//     "Greater than",
//     "Lesser than",
//     "Greater or equal than",
//     "Lesser or equal than",
//     "Equal",
//     "Not equal",
// ];

const ParamMenu: React.FC<ParamMenuProp> = ({ headers, className = "" }) => {
    const [isMenuShowing, setIsMenuShowing] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItemProp[]>([]);
    const menuRef = useRef(null);
    const [newItem, setNewItem] = useState<MenuItemProp>({
        param: "",
        column: "",
        equalizer: ">",
        equalTo: "",
    });

    // const handleAddItems = (key: string, value: string) => {
    //     const newItem = setMenuItems((prev) => [...prev]);
    // };

    const addItem = () => {
        const newItem: MenuItemProp = {
            param: "",
            equalizer: equalizerList[0],
            equalTo: "",
            column: "",
        };
        setMenuItems((prev) => [...prev, newItem]);
    };

    const removeItem = (index: number) => {
        const newArray = menuItems.splice(index, 1);
        setMenuItems(newArray);
    };

    // Handle click outside
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
        <div className={`${className} relative z-10 mt-1`} ref={menuRef}>
            <button
                onClick={() => setIsMenuShowing(!isMenuShowing)}
                type="button"
                className="w-full cursor-pointer select-none rounded border py-0.5 text-center hover:bg-neutral-200 dark:border-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-500"
            >
                Add Special Params
            </button>

            <div
                className={`absolute ${isMenuShowing ? "visible" : "invisible"} left-0 top-8 z-50 min-w-max rounded border p-1 dark:border-neutral-500 dark:bg-neutral-800`}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <Dropdown
                            showArrow={false}
                            options={params}
                            setItem={(data: string) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    param: data,
                                }))
                            }
                        />
                        <Dropdown
                            className="z-50 min-w-max"
                            showArrow={false}
                            options={headers}
                            setItem={(data: string) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    column: data,
                                }))
                            }
                        />
                        <Dropdown
                            options={[...equalizerList]}
                            showArrow={false}
                            // values={equalizerName}
                            setItem={(data: string) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    equalizer: data as Equalizer,
                                }))
                            }
                        />
                        <input
                            onChange={(e) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    equalTo: e.target.value,
                                }))
                            }
                            className="dark: w-20 rounded border dark:border-neutral-500 dark:bg-neutral-700"
                        />
                        <button>
                            <Add />
                        </button>
                    </div>
                    {menuItems.map((item, idx) => (
                        <div key={idx}></div>
                    ))}
                </div>
                <div className="w-full py-1">
                    <button
                        type="button"
                        className="w-full rounded py-0.5 dark:bg-neutral-600 dark:hover:bg-neutral-500 "
                        onClick={() => addItem()}
                    >
                        <Add />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParamMenu;

import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../../Inputs/Dropdown";
import { Add, Delete } from "@mui/icons-material";

const equalizerList = [">", "<", ">=", "<=", "==", "!="] as const;
const params = ["ADD_IF", "COUNT_IF", "VLOOKUP"] as const;
type Equalizer = (typeof equalizerList)[number];
type Params = (typeof params)[number];

interface MenuItemProp {
    param: Params;
    column: string;
    equalizer: Equalizer;
    equalTo: string | number;
}

interface ParamMenuProp {
    headers: string[];
    className?: string;
    setParameters: React.Dispatch<React.SetStateAction<MenuItemProp[]>>;
}

const equalizerName = [
    "Greater than",
    "Lesser than",
    "Greater or equal than",
    "Lesser or equal than",
    "Equal",
    "Not equal",
];

const ParamMenu: React.FC<ParamMenuProp> = ({
    headers,
    className = "",
    setParameters,
}) => {
    const [isMenuShowing, setIsMenuShowing] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItemProp[]>([]);
    const menuRef = useRef(null);
    const [newItem, setNewItem] = useState<MenuItemProp>({
        param: params[0],
        column: headers[0],
        equalizer: ">",
        equalTo: "0",
    });

    const addItem = () => {
        setMenuItems((prev) => [...prev, newItem]);
    };
    /**
     *
     * @param {number} index
     */
    const removeItem = (index: number) => {
        setMenuItems((prev) => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
    };

    const makeItemText = (index: number, item: MenuItemProp): string => {
        return `${index}. ${item.param}: ${item.column} ${item.equalizer} ${item.equalTo}`;
    };

    // Returned List
    useEffect(() => {
        setParameters(menuItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuItems]);

    // Handle click outside
    /**
     *
     * @param {MouseEvent} event
     */
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
                className="w-full cursor-pointer select-none rounded border border-neutral-300 py-0.5 text-center hover:bg-neutral-200 dark:border-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-500"
            >
                Add Special Params
            </button>

            <div
                className={`${isMenuShowing ? "visible" : "invisible"} absolute left-0 top-8 z-50 min-w-max rounded border bg-white p-1 shadow dark:border-neutral-500 dark:bg-neutral-800 `}
            >
                <div className="divide-y">
                    {menuItems.length > 0 &&
                        menuItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="mb-1 flex items-center justify-between border-neutral-300 py-0.5 dark:border-neutral-600"
                            >
                                <p className="font-mono">
                                    {makeItemText(idx + 1, item)}
                                </p>
                                <button
                                    type="button"
                                    className=".5 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                    onClick={() => removeItem(idx)}
                                >
                                    <Delete />
                                </button>
                            </div>
                        ))}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <Dropdown
                            showArrow={false}
                            options={[...params]}
                            setItem={(data: string) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    param: data as Params,
                                }))
                            }
                        />
                        :
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
                            values={equalizerName}
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
                            value={newItem.equalTo}
                            placeholder="0"
                            className="dark: w-20 rounded  border border-neutral-300 px-1 py-0.5 focus:outline-none dark:border-neutral-500 dark:bg-neutral-700"
                        />
                        <button
                            className="flex h-6 w-6 items-center justify-center rounded border border-neutral-300 hover:bg-neutral-200 dark:border-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                            type="button"
                            onClick={addItem}
                        >
                            <Add />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParamMenu;

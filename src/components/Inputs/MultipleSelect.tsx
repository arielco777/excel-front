import { Check, Close, ExpandMore } from "@mui/icons-material";
import React, { FC, useEffect, useRef, useState } from "react";

interface MultipleSelectProp {
    disabled?: boolean;
    options: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultipleSelect: FC<MultipleSelectProp> = ({
    disabled,
    options,
    setItems,
}) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isMenuShowing, setIsMenuShowing] = useState<boolean>(false);
    const menuRef = useRef(null);

    const toggleItem = (item: string) => {
        setSelectedItems((prev) => {
            const newSelectedItems = prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item];
            return newSelectedItems;
        });
    };

    useEffect(() => {
        setItems(selectedItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItems]);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
        ) {
            setIsMenuShowing(false);
        }
    };

    // Click outside of menu
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuShowing]);

    //TODO: Fix menu getting bigger with items in the list but in disabled
    return (
        <div className="relative w-full" ref={menuRef}>
            <div
                className={`flex w-full flex-wrap justify-between ${isMenuShowing && "bg-neutral-200"} ${disabled ? "bg-neutral-200 text-neutral-400 dark:bg-neutral-600" : " dark:bg-neutral-700 "} overflow-hidden rounded border border-neutral-300 dark:border-neutral-500`}
            >
                <div
                    className={`flex flex-1 flex-wrap ${selectedItems.length == 0 ? "items-start" : !disabled ? "p-1" : "p-0.5"} items-start gap-1`}
                >
                    {!disabled ? (
                        selectedItems.length > 0 ? (
                            selectedItems.map((item) => (
                                <button
                                    type="button"
                                    disabled={disabled}
                                    className={`${disabled ? "bg-neutral-200 text-neutral-400 dark:bg-neutral-600 " : "bg-blue-200 hover:bg-blue-300 dark:bg-blue-400 dark:text-black"} flex h-5 w-max items-center justify-between gap-1 rounded-lg px-1.5 text-xs`}
                                    key={item}
                                    onClick={() => toggleItem(item)}
                                >
                                    {item}
                                    <Close
                                        style={{
                                            width: "10px",
                                        }}
                                    />
                                </button>
                            ))
                        ) : (
                            <span
                                onClick={() =>
                                    setIsMenuShowing((prev) => !prev)
                                }
                                className={`${!disabled && "cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-500"} h-full w-full pl-1`}
                            >
                                No Columns Chosen
                            </span>
                        )
                    ) : (
                        <span
                            onClick={() => setIsMenuShowing((prev) => !prev)}
                            className={`${!disabled && "cursor-pointer hover:bg-neutral-200 "} w-full pl-1`}
                        >
                            All Columns
                        </span>
                    )}
                </div>
                <button
                    className={` border-l ${disabled ? "dark:border-neutral-500" : "hover:bg-neutral-200  dark:border-neutral-500 dark:hover:bg-neutral-500 "} `}
                    type="button"
                    disabled={disabled}
                    onClick={() => setIsMenuShowing((prev) => !prev)}
                >
                    <ExpandMore />
                </button>
            </div>
            {/* Menu */}
            <div
                className={`${isMenuShowing ? "visible" : "invisible"} absolute top-7 z-50 max-h-52 w-full cursor-pointer overflow-y-auto rounded-lg border bg-white ${!disabled && "p-0.5"} shadow shadow-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none`}
            >
                {options.map((item) => (
                    <p
                        key={item}
                        onClick={() => toggleItem(item)}
                        className={`flex select-none items-center justify-between gap-1 rounded-lg px-2 hover:bg-neutral-200 dark:hover:bg-neutral-600`}
                    >
                        {item}
                        {selectedItems.includes(item) ? (
                            <Check style={{ width: "13px" }} />
                        ) : (
                            <span className="w-[10px]" />
                        )}
                    </p>
                ))}
            </div>
        </div>
    );
};

MultipleSelect.displayName = "MultipleSelect";

export default MultipleSelect;

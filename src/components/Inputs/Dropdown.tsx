import { Check, ExpandMore } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

interface DropdownProps {
    disabled?: boolean;
    values?: string[];
    options: string[];
    className?: string;
    defaultValue?: string;
    showArrow?: boolean;
    setItem: React.Dispatch<React.SetStateAction<string>>;
}

//TODO: Finish this
const Dropdown: React.FC<DropdownProps> = ({
    disabled = false,
    values = [],
    className = "",
    options,
    defaultValue,
    showArrow = true,
    setItem,
}) => {
    const [selectedItem, setSelectedItem] = useState<string>(
        values.length > 0 ? values[0] : options[0],
    );
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

    useEffect(() => {
        setItem(options[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`${className} relative w-full`} ref={menuRef}>
            <div
                className={`flex w-full flex-wrap justify-between ${isMenuShowing && "bg-neutral-200"} ${disabled ? "bg-neutral-200 text-neutral-400 dark:bg-neutral-600" : " dark:bg-neutral-700 "} overflow-hidden rounded border border-neutral-300 dark:border-neutral-500`}
            >
                <div
                    className={`flex w-max flex-1 flex-wrap ${selectedItem === "" ? "items-start" : ""} items-start gap-1 `}
                >
                    {!disabled ? (
                        <span
                            onClick={() => setIsMenuShowing((prev) => !prev)}
                            className={`${!disabled && "cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-500"} w-full px-1 py-0.5`}
                        >
                            {selectedItem !== ""
                                ? selectedItem
                                : defaultValue
                                  ? defaultValue
                                  : "No Columns Chosen"}
                        </span>
                    ) : (
                        <span
                            onClick={() => setIsMenuShowing((prev) => !prev)}
                            className={`${!disabled && "cursor-pointer hover:bg-neutral-200 "} w-full py-0.5 pl-1`}
                        >
                            None Chosen
                        </span>
                    )}
                </div>
                {showArrow && (
                    <button
                        className={` border-l ${disabled ? "dark:border-neutral-500" : "hover:bg-neutral-200  dark:border-neutral-500 dark:hover:bg-neutral-500 "} `}
                        type="button"
                        disabled={disabled}
                        onClick={() => setIsMenuShowing((prev) => !prev)}
                    >
                        <ExpandMore />
                    </button>
                )}
            </div>
            {/* Menu */}
            <div
                className={`${isMenuShowing ? "visible" : "invisible"} absolute top-8 z-50 max-h-52 w-max cursor-pointer overflow-y-auto rounded-lg border bg-white p-0.5 shadow shadow-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none`}
            >
                {values.length > 0
                    ? values.map((item, index) => (
                          <p
                              key={index}
                              onClick={() => {
                                  setSelectedItem(item);
                                  setItem(options[index]);
                                  setIsMenuShowing(false);
                              }}
                              className={`flex select-none items-center justify-between gap-1 rounded-lg px-2 hover:bg-neutral-200 dark:hover:bg-neutral-600`}
                          >
                              {item}
                              {selectedItem === item && (
                                  <Check style={{ width: "13px" }} />
                              )}
                          </p>
                      ))
                    : options.map((item) => (
                          <p
                              key={item}
                              onClick={() => {
                                  setSelectedItem(item);
                                  setItem(item);
                                  setIsMenuShowing(false);
                              }}
                              className={`flex select-none items-center justify-between gap-1 rounded-lg px-2 hover:bg-neutral-200 dark:hover:bg-neutral-600`}
                          >
                              {item}
                              {selectedItem === item && (
                                  <Check style={{ width: "13px" }} />
                              )}
                          </p>
                      ))}
            </div>
        </div>
    );
};
export default Dropdown;

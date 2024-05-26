import React, { useState } from "react";
// import { ResponseActionType } from "../../../types/Enums/SidebarActions";
// import { RequestType } from "../../../types/Interfaces/RequestInterface";
import { Download } from "@mui/icons-material";
import MultipleSelect from "../../Inputs/MultipleSelect";
import ParamMenu from "../Params/ParamMenu";
import Dropdown from "../../Inputs/Dropdown";
import { ResponseActionType } from "../../../types/Enums/SidebarActions";
import { RequestType } from "../../../types/Interfaces/RequestInterface";
interface ResponseAction {
    action: ResponseActionType;
    objects: RequestType | null;
}

interface SidebarProps {
    headers: string[];
    response: (action: ResponseAction) => void;
    fileTitle: string;
    csv: boolean;
    isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    headers,
    response,
    fileTitle,
    csv,
    isLoading,
}) => {
    const [desiredChosen, setDesiredChosen] = useState(false);
    const [groupChosen, setGroupChosen] = useState(false);
    const [sortChosen, setSortChosen] = useState(false);
    // const [totalChosen, setTotalChosen] = useState(false);
    // const [avgChosen, setAvgChosen] = useState(false);

    const [desiredItems, setDesiredItems] = useState<string[]>();
    const [groupItem, setGroupItem] = useState<string>();
    const [groupDirItem, setGroupDirItem] = useState<"asc" | "des">();
    const [sortItem, setSortItem] = useState<string>();
    const [sortDirItem, setSortDirItem] = useState<"asc" | "des">();

    const [delimiter, setDelimiter] = useState(",");
    const [parameters, setParameters] = useState([]);

    const handleResponse = () => {
        const desired = desiredChosen ? desiredItems : headers;
        const groupBy = groupChosen ? groupItem : "none";
        const groupDir = groupDirItem;
        const sortBy = sortChosen ? sortItem : "none";
        const sortDir = sortDirItem;

        const objects = {
            sortDir,
            sortBy,
            groupBy,
            groupDir,
            desired,
            // totalChosen,
            // avgChosen,
            parameters,
        };

        if (csv) {
            objects["delimiter"] = delimiter;
        }

        response({
            action: ResponseActionType.Send,
            objects,
        });
    };

    const handleCloseDoc = () => {
        response({
            action: ResponseActionType.Close,
            objects: null,
        });
    };

    const handleDownload = (e: React.SyntheticEvent) => {
        e.preventDefault();

        response({
            action: ResponseActionType.Download,
            objects: null,
        });
    };

    return (
        <div className="flex h-screen w-64 flex-col justify-between text-ellipsis border-r border-neutral-300 bg-neutral-100 text-black dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-200">
            <div className="flex w-full flex-col">
                {/* File Title */}
                {fileTitle && (
                    <div className="mx-auto mt-2">
                        <h1 className="font-bold">{fileTitle}</h1>
                    </div>
                )}
                <div className="flex w-full flex-col gap-5 p-2">
                    {/* Desired Chosen */}
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="desired"
                                className={`${
                                    !desiredChosen && "text-neutral-500"
                                }`}
                            >
                                Desired Columns:{" "}
                            </label>
                            <input
                                type="checkbox"
                                className="cursor-pointer"
                                onChange={() =>
                                    setDesiredChosen((prev) => !prev)
                                }
                            />
                        </div>
                        {/* {memoizedMultipleSelect} */}
                        <MultipleSelect
                            disabled={!desiredChosen}
                            options={headers}
                            setItems={setDesiredItems}
                        />
                    </div>
                    {/* Group Chosen */}
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex w-full items-center gap-3 ">
                            <div
                                className={`${
                                    !groupChosen
                                        ? "text-neutral-400 dark:text-neutral-500"
                                        : "text-neutral-800 dark:text-neutral-200"
                                } flex w-full items-center gap-1`}
                            >
                                Group
                                <div className="w-full grow">
                                    <Dropdown
                                        options={["asc", "desc"]}
                                        values={["Ascending", "Descending"]}
                                        disabled={!groupChosen}
                                        setItem={setGroupDirItem}
                                    />
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="cursor-pointer"
                                onChange={() => setGroupChosen((prev) => !prev)}
                            />
                        </div>
                        <Dropdown
                            options={headers}
                            disabled={!groupChosen}
                            setItem={setGroupItem}
                        />
                    </div>
                    {/* Sort Chosen */}
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex w-full items-center gap-3 ">
                            <div
                                className={`${
                                    !groupChosen
                                        ? "text-neutral-400 dark:text-neutral-500"
                                        : "text-neutral-800 dark:text-neutral-200"
                                } flex w-full items-center gap-1`}
                            >
                                Sort
                                <div className="w-full grow">
                                    <Dropdown
                                        options={["asc", "desc"]}
                                        values={["Ascending", "Descending"]}
                                        disabled={!sortChosen}
                                        setItem={setSortDirItem}
                                    />
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="cursor-pointer"
                                onChange={() => setSortChosen((prev) => !prev)}
                            />
                        </div>
                        <Dropdown
                            options={headers}
                            disabled={!sortChosen}
                            setItem={setSortItem}
                        />
                    </div>
                    {/* More Info */}
                    <div className="">
                        {/* <h4 className="text-lg">More Column Info</h4> */}
                        {/* Sum
                        <div className="w-max  rounded px-2 hover:bg-neutral-200 dark:hover:bg-neutral-500">
                            <input
                                type="checkbox"
                                id="sum"
                                name="sum"
                                className="mr-1 cursor-pointer"
                                onChange={() => setTotalChosen((prev) => !prev)}
                            />
                            <label
                                htmlFor="sum"
                                className="cursor-pointer select-none"
                            >
                                Sum
                            </label>
                        </div>
                        {/* Avg */}
                        {/* <div className="w-max rounded px-2 hover:bg-neutral-200 dark:hover:bg-neutral-500">
                            <input
                                type="checkbox"
                                id="avg"
                                name="avg"
                                className="mr-1 cursor-pointer"
                                onChange={() => setAvgChosen((prev) => !prev)}
                            />
                            <label
                                htmlFor="avg"
                                className="cursor-pointer select-none"
                            >
                                Average
                            </label>
                        </div>  */}

                        {/* Params */}
                        <div className="w-full">
                            <ParamMenu
                                headers={headers}
                                setParameters={setParameters}
                            />
                        </div>
                    </div>

                    {/* Delimiter */}
                    {csv && (
                        <div className="">
                            <span className="text-lg">CSV Delimiter:</span>
                            <select
                                className="cursor-pointer rounded border border-neutral-300 bg-white px-1 py-1 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-500 dark:text-neutral-200  dark:hover:bg-neutral-400"
                                defaultValue={","}
                                onChange={(e) => setDelimiter(e.target.value)}
                            >
                                <option value="none" disabled>
                                    Select delimiter
                                </option>
                                <option value=",">Comma (,)</option>
                                <option value=";">Semicolumn (;)</option>
                                <option value="|">Pipe (|)</option>
                            </select>
                        </div>
                    )}

                    {/* Submit Btn */}
                    <button
                        type="submit"
                        onClick={handleResponse}
                        disabled={isLoading}
                        className="rounded bg-green-500 py-1 hover:bg-green-400 dark:bg-green-600 dark:text-black dark:hover:bg-green-500"
                    >
                        Submit
                    </button>
                </div>
                {/* Download Btn */}
                <button
                    type="submit"
                    onClick={handleDownload}
                    className="mx-2 rounded bg-blue-500 py-1 text-black hover:bg-blue-400"
                >
                    <Download />
                </button>
                {/* </form> */}
            </div>
            {/* Close Doc Btn */}
            <button
                onClick={handleCloseDoc}
                className="mx-2 mb-2 rounded bg-red-500 py-2 text-lg hover:bg-red-400"
            >
                Close Document
            </button>
        </div>
    );
};

export default Sidebar;

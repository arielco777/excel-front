import React, { useState } from "react";
import { ResponseActionType } from "../../../Types/Enums/SidebarActions";
import { RequestType } from "../../../Types/Interfaces/RequestInterface";
import { Download } from "@mui/icons-material";
import MultipleSelect from "../../Inputs/MultipleSelect";

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
    const [totalChosen, setTotalChosen] = useState(false);
    const [avgChosen, setAvgChosen] = useState(false);

    const [desiredItems, setDesiredItems] = useState<string[]>();

    const [delimiter, setDelimiter] = useState(",");

    const handleResponse = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            groupBy: { value: string };
            groupDir: { value: "asc" | "des" | undefined };
            headerColor: { value: string };
            sortBy: { value: string };
            sortDir: { value: "asc" | "des" | undefined };
            avg: { selectedOptions: { value: string } };
        };

        const desired = desiredChosen ? desiredItems : headers;
        const groupBy = groupChosen ? target.groupBy.value : "none";
        const groupDir = target.groupDir.value;
        const sortBy = sortChosen ? target.sortBy.value : "none";
        const sortDir = target.sortDir.value;

        const objects = {
            sortDir,
            sortBy,
            groupBy,
            groupDir,
            desired,
            totalChosen,
            avgChosen,
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
        <div className="flex h-screen w-64 flex-col justify-between overflow-hidden text-ellipsis border-r border-neutral-300 bg-neutral-100 text-black dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-200">
            <div className="flex w-full flex-col">
                {fileTitle && (
                    <div className="mx-auto mt-2">
                        <h1 className="font-bold">{fileTitle}</h1>
                    </div>
                )}
                <form
                    onSubmit={handleResponse}
                    className="flex w-full flex-col gap-5 p-2"
                >
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
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <p
                                className={`${
                                    !groupChosen
                                        ? "text-neutral-400 dark:text-neutral-500"
                                        : "text-neutral-800 dark:text-neutral-200"
                                } flex gap-1`}
                            >
                                Group
                                <select
                                    className={`${
                                        groupChosen
                                            ? "cursor-pointer bg-white hover:bg-neutral-200 dark:bg-neutral-500 dark:text-neutral-200 dark:hover:bg-neutral-400"
                                            : "bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-500"
                                    } rounded border border-neutral-300 py-0.5 pl-1 dark:border-neutral-700 `}
                                    name="groupDir"
                                    disabled={!groupChosen}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="des">Descending</option>
                                </select>
                            </p>
                            <input
                                type="checkbox"
                                className="cursor-pointer"
                                onChange={() => setGroupChosen((prev) => !prev)}
                            />
                        </div>
                        <select
                            disabled={!groupChosen}
                            name="groupBy"
                            id="groupBy"
                            className={`${
                                groupChosen
                                    ? "cursor-pointer bg-white hover:bg-neutral-200 dark:bg-neutral-500 dark:hover:bg-neutral-400"
                                    : "bg-neutral-200 text-neutral-400 dark:bg-neutral-600"
                            }  rounded border border-neutral-300 px-1 py-1 dark:border-neutral-700`}
                        >
                            {headers.map((item) => (
                                <option value={item} key={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <p
                                className={`${
                                    !sortChosen
                                        ? "text-neutral-400 dark:text-neutral-500"
                                        : "text-neutral-800 dark:text-neutral-200"
                                } flex gap-1`}
                            >
                                Sort
                                <select
                                    className={`${
                                        sortChosen
                                            ? "cursor-pointer bg-white hover:bg-neutral-200 dark:bg-neutral-500 dark:text-neutral-200 dark:hover:bg-neutral-400"
                                            : "bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-500"
                                    } rounded border border-neutral-300 py-0.5 pl-1 dark:border-neutral-700 `}
                                    name="sortDir"
                                    disabled={!sortChosen}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="des">Descending</option>
                                </select>
                            </p>
                            <input
                                type="checkbox"
                                className="cursor-pointer"
                                onChange={() => setSortChosen((prev) => !prev)}
                            />
                        </div>
                        <select
                            disabled={!sortChosen}
                            name="sortBy"
                            id="sortBy"
                            className={`${
                                sortChosen
                                    ? "cursor-pointer bg-white hover:bg-neutral-200 dark:bg-neutral-500 dark:hover:bg-neutral-400"
                                    : "bg-neutral-200 text-neutral-400 dark:bg-neutral-600"
                            }  rounded border border-neutral-300 px-1 py-1  dark:border-neutral-700`}
                        >
                            {headers.map((item) => (
                                <option value={item} key={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="">
                        <h4 className="text-lg">More Column Info</h4>
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
                        <div className="w-max rounded px-2 hover:bg-neutral-200 dark:hover:bg-neutral-500">
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
                        </div>
                    </div>

                    {/* <label htmlFor="headerColor">Header Color: </label>
                    <input id="headerColor" name="headerColor" type="color" /> */}
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded bg-green-500 py-1 hover:bg-green-400 dark:bg-green-600 dark:text-black dark:hover:bg-green-500"
                    >
                        Submit
                    </button>
                </form>

                {/* <form
                    className="text-black w-full flex flex-col gap-2 p-2"
                    onSubmit={handleDownload}
                > */}
                {/* <div className="flex flex-col">
                        <input
                            id="docName"
                            name="docName"
                            placeholder="Document name"
                            className="rounded py-0.5 px-1"
                            onChange={(e) => setDocName(e.target.value)}
                        />
                    </div> */}
                <button
                    type="submit"
                    onClick={handleDownload}
                    className="mx-2 rounded bg-blue-500 py-1 text-black hover:bg-blue-400"
                >
                    <Download />
                </button>
                {/* </form> */}
            </div>

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

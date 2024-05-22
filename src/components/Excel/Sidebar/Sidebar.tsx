import React, { useState } from "react";
import "./Sidebar.css";
import { ResponseActionType } from "../../../Types/Enums/SidebarActions";
import { RequestType } from "../../../Types/Interfaces/RequestInterface";
import { Download } from "@mui/icons-material";

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

    const [delimiter, setDelimiter] = useState(",");

    const handleResponse = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            groupBy: { value: string };
            groupDir: { value: "asc" | "des" | undefined };
            headerColor: { value: string };
            sortBy: { value: string };
            sortDir: { value: "asc" | "des" | undefined };
            desired: { selectedOptions: { value: string }[] };
            avg: { selectedOptions: { value: string } };
        };

        const desired = desiredChosen
            ? Array.from(target.desired.selectedOptions).map(
                  (option) => option.value
              )
            : headers;
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
        <div className="bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 w-64 flex flex-col justify-between text-black overflow-hidden text-ellipsis h-screen">
            <div className="w-full flex flex-col">
                {fileTitle && (
                    <div className="mx-auto mt-2">
                        <h1 className="font-bold">{fileTitle}</h1>
                    </div>
                )}
                <form
                    onSubmit={handleResponse}
                    className="w-full flex flex-col gap-2 p-2"
                >
                    <div className="flex gap-3 items-center">
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
                            className="accent-blue-400 dark:accent-blue-600"
                            onChange={() => setDesiredChosen((prev) => !prev)}
                        />
                    </div>
                    <select
                        name="desired"
                        id="desired"
                        multiple
                        disabled={!desiredChosen}
                        size={4}
                        className={`${
                            !desiredChosen
                                ? "bg-neutral-200 dark:bg-neutral-200 dark:text-neutral-300"
                                : "dark:bg-neutral-300 text-neutral-700"
                        }`}
                        style={{
                            overflowY: !desiredChosen
                                ? "-moz-hidden-unscrollable"
                                : "auto",
                        }}
                    >
                        {headers.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-3 items-center">
                        <p
                            className={`${
                                !groupChosen &&
                                "text-neutral-500 dark:text-neutral-500"
                            } flex gap-1`}
                        >
                            Group
                            <select
                                className={`pl-1 py-0.5 rounded ${
                                    groupChosen
                                        ? "dark:text-neutral-300 bg-neutral-500"
                                        : "dark:text-neutral-500 bg-neutral-600"
                                }`}
                                name="groupDir"
                                disabled={!groupChosen}
                            >
                                <option value="asc">Ascending</option>
                                <option value="des">Descending</option>
                            </select>
                        </p>
                        <input
                            type="checkbox"
                            onChange={() => setGroupChosen((prev) => !prev)}
                        />
                    </div>
                    <select
                        disabled={!groupChosen}
                        name="groupBy"
                        id="groupBy"
                        className={`${
                            groupChosen
                                ? "bg-white"
                                : "bg-neutral-200 text-neutral-500"
                        } py-1 px-1 rounded cursor-pointer hover:bg-neutral-200`}
                    >
                        {headers.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-3 items-center">
                        <p
                            className={`${
                                !sortChosen && "text-neutral-500"
                            } flex gap-1`}
                        >
                            Sort
                            <select
                                className="pl-1 py-0.5 rounded"
                                name="sortDir"
                                disabled={!sortChosen}
                            >
                                <option value="asc">Ascending</option>
                                <option value="des">Descending</option>
                            </select>
                        </p>
                        <input
                            type="checkbox"
                            onChange={() => setSortChosen((prev) => !prev)}
                        />
                    </div>
                    <select
                        disabled={!sortChosen}
                        name="sortBy"
                        id="sortBy"
                        className={`${
                            sortChosen
                                ? "bg-white"
                                : "bg-neutral-200 text-neutral-500"
                        } py-1 px-1 rounded cursor-pointer hover:bg-neutral-200`}
                    >
                        {headers.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <section className="">
                        <h4 className="text-md">More Column Info</h4>
                        <input
                            type="checkbox"
                            id="sum"
                            name="sum"
                            className="mr-1"
                            onChange={() => setTotalChosen((prev) => !prev)}
                        />
                        <label htmlFor="sum">Sum</label>
                        <br />
                        <input
                            type="checkbox"
                            id="avg"
                            name="avg"
                            className="mr-1"
                            onChange={() => setAvgChosen((prev) => !prev)}
                        />
                        <label htmlFor="avg">Average</label>
                    </section>

                    {/* <label htmlFor="headerColor">Header Color: </label>
                    <input id="headerColor" name="headerColor" type="color" /> */}
                    {csv && (
                        <div className="">
                            CSV Delimiter:
                            <select
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
                        className="bg-green-500 rounded py-1 hover:bg-green-400"
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
                    className="bg-blue-500 rounded py-1 hover:bg-blue-400 text-black mx-2"
                >
                    <Download />
                </button>
                {/* </form> */}
            </div>

            <button
                onClick={handleCloseDoc}
                className="bg-red-500 py-2 hover:bg-red-400 text-lg mx-2 mb-2 rounded"
            >
                Close Document
            </button>
        </div>
    );
};

export default Sidebar;

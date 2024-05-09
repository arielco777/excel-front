import React, { useState } from "react";
import "./Sidebar.css";
import { ResponseActionType } from "../../../Types/Enums/SidebarActions";
import { RequestType } from "../../../Types/Interfaces/RequestInterface";

interface ResponseAction {
    action: ResponseActionType;
    objects: RequestType | null;
}

interface SidebarProps {
    headers: string[];
    response: (action: ResponseAction) => void;
    fileTitle: string;
    csv: boolean;
    loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    headers,
    response,
    fileTitle,
    csv,
    loading = false,
}) => {
    const [desiredChosen, setDesiredChosen] = useState(false);
    const [groupChosen, setGroupChosen] = useState(false);
    const [sortChosen, setSortChosen] = useState(false);

    const [docName, setDocName] = useState("");

    const [delimiter, setDelimiter] = useState("");

    const handleResponse = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            groupBy: { value: string };
            headerColor: { value: string };
            sortDir: { value: "asc" | "des" | undefined };
            sortBy: { value: string };
            desired: { selectedOptions: { value: string }[] };
        };

        const desired = desiredChosen
            ? Array.from(target.desired.selectedOptions).map(
                  (option) => option.value
              )
            : headers;
        // const sortBy = Array.from(target.sortBy.selectedOptions).map(
        //     (option) => option.value
        // );
        const sortBy = sortChosen ? target.sortBy.value : "none";
        const sortDir = target.sortDir.value;
        const groupBy = groupChosen ? target.groupBy.value : "none";

        const objects = {
            sortDir,
            sortBy,
            groupBy,
            desired,
        };

        if (csv) {
            console.log("Delimiter: ", delimiter);
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
            objects: {
                docName,
            },
        });
    };

    return (
        <div className="bg-neutral-300 w-60 flex flex-col justify-between text-black overflow-hidden text-ellipsis h-screen">
            <div className="w-full flex flex-col">
                {fileTitle && (
                    <div className="mx-auto mt-2">
                        <h1 className="font-bold">{fileTitle}</h1>
                    </div>
                )}
                <form
                    onSubmit={handleResponse}
                    className="text-black w-full flex flex-col gap-2 p-2"
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
                            onChange={() => setDesiredChosen((prev) => !prev)}
                        />
                    </div>
                    <select
                        name="desired"
                        id="desired"
                        multiple
                        disabled={!desiredChosen}
                        size={4}
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
                        <label
                            htmlFor="groupBy"
                            className={`${!groupChosen && "text-neutral-500"}`}
                        >
                            Group By:
                        </label>
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
                        <p className={`${!sortChosen && "text-neutral-500"}`}>
                            Sort{" "}
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

                    {/* <label htmlFor="headerColor">Header Color: </label>
                    <input id="headerColor" name="headerColor" type="color" /> */}
                    {csv && (
                        <div className="">
                            CSV Delimiter:
                            <select
                                onChange={(e) => setDelimiter(e.target.value)}
                            >
                                <option value=",">Comma (,)</option>
                                <option value=";">Semicolumn (;)</option>
                                <option value="|">Pipe (|)</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 rounded py-1 hover:bg-green-400"
                    >
                        Submit
                    </button>
                </form>
                <form
                    className="text-black w-full flex flex-col gap-2 p-2"
                    onSubmit={handleDownload}
                >
                    <div className="flex flex-col">
                        <label htmlFor="docName" className="">
                            Document Name:
                        </label>
                        <input
                            id="docName"
                            name="docName"
                            placeholder="Default: output"
                            className="rounded py-0.5 px-1"
                            onChange={(e) => setDocName(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 rounded py-1 hover:bg-blue-400 text-black"
                    >
                        Download
                    </button>
                </form>
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

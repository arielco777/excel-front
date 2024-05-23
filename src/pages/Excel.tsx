import { useRef, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
    ParsedCSVRow,
    RequestType,
} from "../Types/Interfaces/RequestInterface";
import { ResponseActionType } from "../Types/Enums/SidebarActions";
import Sidebar from "../components/Excel/Sidebar/Sidebar";

import Dropzone from "../components/Excel/Dropzone/Dropzone";
import ExcelTable from "../components/Excel/ExcelTable/ExcelComponent";
import Hero from "../components/Home/Hero/Hero";
import { Close, DarkMode, LightMode } from "@mui/icons-material";

const serverUrl = "http://localhost:5000";

let uploaded = false;

const ExcelPage = () => {
    const [originalFile, setOriginalFile] = useState<File | undefined>();
    const [originalHeaders, setOriginalHeaders] = useState<string[]>([]);

    const [fileTitle, setFileTitle] = useState("");
    const [isCsv, setIsCsv] = useState(false);

    const [fileToDownload, setFileToDownload] = useState<File | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [showDownload, setShowDownload] = useState(false);
    const [downloadName, setDownloadName] = useState("");

    const [headers, setHeaders] = useState<string[]>([]);
    const [parsedCSVFile, setParsedCSVFile] = useState<ParsedCSVRow[]>([]);

    const [darkMode, setDarkMode] = useState(true);

    const topBar = useRef<HTMLDivElement>(null);

    const reset = () => {
        uploaded = false;
        setOriginalFile(undefined);
        setOriginalHeaders([]);
        setIsCsv(false);
        setFileTitle("");

        setFileToDownload(undefined);
        setErrorMessage("");

        setHeaders([]);
        setParsedCSVFile([]);
    };

    const handleSidebarAction = (data: {
        action: ResponseActionType;
        objects: RequestType;
    }) => {
        setErrorMessage("");
        // console.log("Data: ", data);
        switch (data.action) {
            case ResponseActionType.Close:
                reset();
                break;
            case ResponseActionType.Send:
                if (data.objects) {
                    checkAndFormData(data.objects);
                }
                break;
            case ResponseActionType.Download:
                setShowDownload(true);
                break;
        }
    };

    const handleFileUpload = async (file: File) => {
        reset();
        uploaded = true;
        setErrorMessage("");
        if (!file) {
            return;
        }

        setFileTitle(file.name);
        setOriginalFile(file);
        setOriginalHeaders([]);

        if (
            file.name.includes(".xls") ||
            file.name.includes(".xlsx")
            // file?.type.split("/")[1].includes("spreadsheetml") ||
            // file?.type.split("/")[1].includes("ms-excel")
        ) {
            excelToCsv(file);
        } else if (file?.type.split("/")[1] === "csv") {
            setIsCsv(true);
            parseFile(file);
        } else {
            setErrorMessage(
                "Your chosen file isn't a CSV or Excel file extension.",
            );
        }
    };

    const excelToCsv = (file: File) => {
        const reader = new FileReader();

        reader.onload = (evt: ProgressEvent<FileReader>) => {
            const arrayBuffer = evt.target?.result;
            if (arrayBuffer instanceof ArrayBuffer) {
                const data = new Uint8Array(arrayBuffer);
                try {
                    const wb = XLSX.read(data, { type: "array" });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const csvData = XLSX.utils.sheet_to_csv(ws);
                    const blob = new Blob([csvData], {
                        type: "text/csv;charset=utf-8;",
                    });

                    // Create a File object
                    const csvFile = new File([blob], "output.csv", {
                        type: "text/csv",
                    });

                    // console.log("CsvFile: ", csvFile);
                    // setFileToSend(csvFile);
                    parseFile(csvFile);

                    // parseFile(csvFile);
                } catch (error) {
                    console.error("Error processing file: ", error);
                }
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const parseFile = (file: File) => {
        // console.log("File: ", file);
        const reader = new FileReader();

        reader.onload = async ({ target }) => {
            // console.log(target);
            if (!target || !target.result) return;

            const csv = Papa.parse<ParsedCSVRow>(target.result as string, {
                header: true,
            });

            const parsedData = csv.data;
            // console.log("Parsed: ", parsedData);
            if (!parsedData.length) return;

            const headers = Object.keys(parsedData[0]);
            if (uploaded) {
                setOriginalHeaders(headers);
                uploaded = false;
            }
            setHeaders(headers);

            console.log("Parsed Data: ", parsedData);

            setParsedCSVFile(parsedData);
            setIsLoading(false);
        };

        reader.readAsText(file);
    };

    const checkAndFormData = (info: RequestType) => {
        const { desired, groupBy, sortBy } = info;
        // Group Items check
        if (
            groupBy !== "none" &&
            desired.length > 0 &&
            !desired.includes(groupBy)
        ) {
            setErrorMessage("Your Group By isn't in the Desired List");
            return;
        }
        // Sort Items check
        if (
            sortBy !== "none" &&
            desired.length > 0 &&
            !desired.includes(sortBy)
        ) {
            setErrorMessage("Your Sorty By isn't in the Desired List");
            return;
        }
        handleFileManagement(info);
    };

    const handleFileManagement = async (info: RequestType) => {
        try {
            setIsLoading(true);
            const formData = new FormData();

            formData.append("file", originalFile);
            Object.entries(info).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            });

            if (isCsv) {
                if (info.delimiter) {
                    formData.append("delimiter", info.delimiter);
                } else {
                    setIsLoading(false);
                    return setErrorMessage("You need to choose the delimiter");
                }
            }
            console.log("Form: ", formData);
            await sendCsvToGetFormatted(formData);
        } catch (error) {
            console.error("Error in handle: ", error);
            setIsLoading(false);
        }
    };

    const sendCsvToGetFormatted = async (formData: FormData) => {
        try {
            await fetch(`${serverUrl}/excel/csv-format`, {
                method: "POST",
                body: formData,
            })
                .then(async (response) => {
                    console.log("Response Status: ", response.status);
                    if (response.status !== 200)
                        setErrorMessage(await response.text());
                    else return response.blob();
                })
                .then((data: File) => {
                    setFileToDownload(data);
                    excelToCsv(data);
                })
                .catch((error) => console.error("Error Testing File: ", error));
        } catch (err) {
            console.error("Error uploading: ", err);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadFile = async (e) => {
        e.preventDefault();
        const blob = new Blob([fileToDownload], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${
            downloadName.trim() !== "" ? downloadName.trim() : "output"
        }.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div
            className={`flex w-full flex-grow flex-col ${darkMode && "dark"} overflow-x-hidden`}
        >
            {isLoading && (
                <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-neutral-800/50">
                    <div className="rounded-lg bg-neutral-200 px-40 py-20 text-3xl">
                        Loading...
                    </div>
                </div>
            )}
            {originalFile ? (
                <div className="h-full dark:bg-neutral-800">
                    {parsedCSVFile.length > 0 ? (
                        <div className="flex h-full w-full">
                            <Sidebar
                                fileTitle={fileTitle}
                                headers={originalHeaders}
                                response={handleSidebarAction}
                                csv={isCsv}
                                isLoading={isLoading}
                            />
                            <ExcelTable
                                headers={headers}
                                file={parsedCSVFile}
                            />
                        </div>
                    ) : (
                        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-neutral-800/50">
                            <div className="rounded-lg bg-neutral-200 px-40 py-20 text-center text-3xl">
                                Loading.
                                <br />{" "}
                                <span className="text-md">
                                    If your file is in xlsx or xls, try
                                    converting it to csv...
                                </span>
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="fixed left-10 top-10 z-10 flex items-center justify-center rounded-lg bg-red-500 p-5 text-white">
                            {errorMessage}
                            <button
                                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-black hover:bg-neutral-400"
                                onClick={() => setErrorMessage("")}
                            >
                                <span className="text-xl">X</span>
                            </button>
                        </div>
                    )}
                    {showDownload && (
                        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/60">
                            <form
                                className="relative flex flex-col overflow-hidden rounded border bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                onSubmit={downloadFile}
                            >
                                <label htmlFor="file-name">File Name</label>
                                <div className="flex items-end gap-0.5">
                                    <input
                                        placeholder="Default: output"
                                        className="mt-1 rounded border px-2 py-1 focus:outline-none dark:border-neutral-500 dark:bg-neutral-600 dark:text-neutral-300"
                                        name="file-name"
                                        id="file-name"
                                        onChange={(e) =>
                                            setDownloadName(e.target.value)
                                        }
                                    />
                                    <p className="text-neutral-600 dark:text-neutral-300">
                                        .xlsx
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    className="mt-3 rounded bg-blue-600 py-1 text-white transition hover:bg-blue-500"
                                >
                                    Download
                                </button>
                                <button
                                    onClick={() => setShowDownload(false)}
                                    type="button"
                                    className="absolute right-0 top-0 flex items-center justify-center rounded-bl bg-red-500 p-0.5 text-neutral-300 transition duration-75 hover:bg-red-300"
                                >
                                    <Close />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            ) : (
                // TODO: Make this a component or something and add more info
                <div
                    ref={topBar}
                    className="flex h-full w-full flex-col items-center justify-center pb-64 dark:bg-neutral-700"
                >
                    <div className="w-full grow">
                        <Hero />
                    </div>
                    <div className="h-1/3 w-1/2">
                        <Dropzone fileChosen={handleFileUpload} />
                    </div>
                </div>
            )}
            <button
                className="absolute bottom-5 right-5 rounded-full bg-neutral-300 p-1.5 hover:bg-neutral-200 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500"
                onClick={() => setDarkMode((prev) => !prev)}
            >
                {darkMode ? <DarkMode /> : <LightMode />}
            </button>
        </div>
    );
};

export default ExcelPage;

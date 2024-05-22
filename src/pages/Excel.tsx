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

    const [darkMode, setDarkMode] = useState(false);

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
                "Your chosen file isn't a CSV or Excel file extension."
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
        <div className={`w-full flex-grow flex flex-col ${darkMode && "dark"}`}>
            {isLoading && (
                <div className="fixed z-50 w-screen h-screen left-0 top-0 bg-neutral-800/50 flex justify-center items-center">
                    <div className="bg-neutral-200 px-40 py-20 rounded-lg text-3xl">
                        Loading...
                    </div>
                </div>
            )}
            {originalFile ? (
                <div className="h-full">
                    {parsedCSVFile.length > 0 && (
                        <div className="flex w-full h-full">
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
                    )}

                    {errorMessage && (
                        <div className="fixed top-10 left-10 z-10 bg-red-500 p-5 rounded-lg text-white flex justify-center items-center">
                            {errorMessage}
                            <button
                                className="absolute -top-2 -right-2 text-black flex justify-center items-center bg-neutral-300 rounded-full w-7 h-7 hover:bg-neutral-400"
                                onClick={() => setErrorMessage("")}
                            >
                                <span className="text-xl">X</span>
                            </button>
                        </div>
                    )}
                    {showDownload && (
                        <div className="fixed z-50 bg-black/60 top-0 left-0 w-screen h-screen flex justify-center items-center">
                            <form
                                className="bg-neutral-300 p-4 flex flex-col relative rounded overflow-hidden"
                                onSubmit={downloadFile}
                            >
                                <label htmlFor="file-name">File Name</label>
                                <input
                                    placeholder="Default output"
                                    className="px-2 py-1 rounded focus:outline-none border mt-1"
                                    name="file-name"
                                    id="file-name"
                                    onChange={(e) =>
                                        setDownloadName(e.target.value)
                                    }
                                />
                                <button
                                    type="submit"
                                    className="mt-3 bg-blue-600 rounded py-1 hover:bg-blue-500 transition "
                                >
                                    Download
                                </button>
                                <button
                                    onClick={() => setShowDownload(false)}
                                    type="button"
                                    className="absolute right-0 top-0 hover:bg-red-400 bg-red-500 rounded-bl flex justify-center items-center p-0.5 transition duration-75"
                                >
                                    {" "}
                                    <Close />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    ref={topBar}
                    className="flex flex-col items-center justify-center h-full w-full "
                >
                    <Hero />
                    <div className="w-1/2 h-1/4">
                        <Dropzone fileChosen={handleFileUpload} />
                    </div>
                </div>
            )}
            <button
                className="absolute top-0 right-0 dark:text-white"
                onClick={() => setDarkMode((prev) => !prev)}
            >
                {darkMode ? <LightMode /> : <DarkMode />}
            </button>
        </div>
    );
};

export default ExcelPage;

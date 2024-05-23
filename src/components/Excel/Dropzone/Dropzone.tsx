import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProp {
    fileChosen: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProp> = ({ fileChosen }) => {
    const onDrop = useCallback(
        (acceptedFile: File[]) => {
            const file = acceptedFile[0];
            if (!file)
                console.log("Only xls, xlsx, and csv extensions are allowed");
            else fileChosen(file);
        },
        [fileChosen],
    );
    const onError = (err) => {
        console.log("Error on drop: ", err);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onError,
        maxFiles: 1,
        accept: {
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
            "text/csv": [".csv"],
        },
    });

    return (
        <div
            className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg border border-neutral-600 text-neutral-500 transition-all hover:bg-neutral-200 dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <div
                className={`h-full w-full rounded-lg text-xl font-medium ${
                    isDragActive && "bg-blue-100"
                } flex select-none items-center justify-center p-5 text-center transition`}
            >
                {isDragActive ? (
                    "Drop the files here ... "
                ) : (
                    <span>
                        Drag'n'Drop <u>xlsx</u>, <u>xls</u>, or <u>csv</u> file
                        here or click to select files
                    </span>
                )}
            </div>
        </div>
    );
};

export default Dropzone;

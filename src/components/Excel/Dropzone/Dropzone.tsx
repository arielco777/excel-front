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
        [fileChosen]
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
            className="cursor-pointer border border-neutral-600 rounded-lg w-full h-full flex text-neutral-500 justify-center items-center hover:bg-neutral-200 transition-all"
            {...getRootProps()}
        >
            <input {...getInputProps()} />

            <div
                className={`w-full h-full rounded-lg text-xl font-medium ${
                    isDragActive && "bg-blue-100"
                } transition flex justify-center items-center text-center p-5 select-none`}
            >
                {isDragActive
                    ? "Drop the files here ... "
                    : "Drag'n'drop Excel file here or click to select files"}
            </div>
        </div>
    );
};

export default Dropzone;

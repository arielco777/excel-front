import React from "react";

interface FileAddProps {
    fileChosen: (file: File) => void;
}

const FileAdd: React.FC<FileAddProps> = ({ fileChosen }) => {
    const handleChosenFile = (file: File) => {
        fileChosen(file);
    };

    return (
        <>
            <label
                htmlFor="file-input"
                className="hover:bg-blue-700 bg-blue-800 px-2 py-1 rounded cursor-pointer"
            >
                Add Excel File
            </label>
            <input
                className="invisible w-0 h-0"
                id="file-input"
                type="file"
                onChange={(e) => {
                    if (e.target.files) handleChosenFile(e.target.files[0]);
                }}
            />
        </>
    );
};

export default FileAdd;

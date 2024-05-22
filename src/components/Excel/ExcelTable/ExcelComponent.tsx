import React from "react";
import { TableVirtuoso } from "react-virtuoso";

interface ParsedCSVRow {
    [key: string]: string;
}

interface ExcelProps {
    headers: string[];
    file: ParsedCSVRow[];
    // headerColor: "white" | string;
}

const ExcelTable: React.FC<ExcelProps> = ({
    headers,
    file,
    // headerColor = "white",
}) => {
    return (
        <div className="w-full text-black">
            <TableVirtuoso
                className="w-full bg-white dark:bg-neutral-800"
                data={file}
                fixedHeaderContent={() => (
                    <tr className="">
                        {headers.map((head, idx) => (
                            <th
                                className="text-bold border-neutral-200 px-1 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                                key={idx}
                            >
                                {head}
                            </th>
                        ))}
                    </tr>
                )}
                itemContent={(_, data) =>
                    Object.values(data).map((d, idx) => (
                        <td
                            className={`text-sm border min-w-20 dark:border-neutral-700 dark:text-neutral-200 dark:bg-neutral-800 ${
                                d === "" && "py-2.5 bg-black"
                            }`}
                            key={idx}
                            style={{
                                // background: "white",
                                // background: headers.includes(d)
                                //     ? headerColor
                                //     : "white",
                                fontWeight: headers.includes(d) ? 700 : 400,
                            }}
                        >
                            {d}
                        </td>
                    ))
                }
            />
        </div>
    );
};

export default ExcelTable;

export interface RequestType {
    desired?: string[];
    groupBy?: string;
    sortDir?: "asc" | "des" | undefined;
    sortBy?: string;
    headerColor?: string;
    delimiter?: string;
    docName?: string;
    avgChosen?: boolean;
    totalChosen?: boolean;
}

export interface ParsedCSVRow {
    [key: string]: string;
}

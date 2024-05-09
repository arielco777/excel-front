export interface RequestType {
    desired?: string[];
    groupBy?: string;
    sortDir?: "asc" | "des" | undefined;
    sortBy?: string;
    headerColor?: string;
    delimiter?: string;
    docName?: string;
}

export interface ParsedCSVRow {
    [key: string]: string;
}

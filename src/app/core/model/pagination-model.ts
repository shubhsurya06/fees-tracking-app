export interface IPagination {
    totalRecords: number;
    totalPages: number;
    pageNumbers: number[];
    sortBy?: string;
    sortDirection?: string;
}
export interface IPagination {
    totalRecords: number;
    totalPages: number;
    pageNumbers: number[];
    pageSize: number;
    sortBy?: string;
    sortDirection?: string;
}
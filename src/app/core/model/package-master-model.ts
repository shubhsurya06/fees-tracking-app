export interface PackageMasterModel {
    packageId: number;
    packageName: string;
    oneTimeTotalCost: string;
    emiTotalCost: string;
    maxBranches: number;
    maxStudents: Date;
    isSmsAlert: boolean;
}
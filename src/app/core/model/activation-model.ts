export interface IActivation {
    activationId: number;
    packageId: number;
    instituteId: number;
    activatedBy: number;
    isActive: number;
    startDate: string;
    endDate: string;
    packageName?: string;
    instituteName?: string;
}
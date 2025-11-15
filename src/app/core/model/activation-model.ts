export interface IActivation {
    activationId: number;
    packageId: number;
    instituteId: number;
    activatedBy: number;
    isActive: number;
    startDate: Date;
    endDate: Date;
    packageName?: string;
    instituteName?: string;
}
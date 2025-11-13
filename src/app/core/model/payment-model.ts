export interface IPayment {
  paymentId: number;
  enrollmentId: number;
  paymentAmount: number;
  receivedByUserId: number;
  paymentModeId: number;
  paymentDate: string;
  enrollmentName?: string;
  paymentModeName?: string;
}
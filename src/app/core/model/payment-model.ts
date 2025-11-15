export interface IPayment {
  paymentId: number;
  enrollmentId: number;
  paymentAmount: number;
  receivedByUserId: number;
  paymentModeId: number;
  paymentDate: string;
  paymentModeName?: string;
  studentName?: string;
  courseName?: string;
}
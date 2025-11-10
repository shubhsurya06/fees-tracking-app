export interface IEnrollment {
  courseId: number;
  enrollmentDoneByUserId: number;
  finalAmount: number;
  discountGiven: number;
  discountApprovedByUserId: number;
  refrenceById: number;
  instituteId: number
  isFeesCompleted: boolean;
  enrollmentDate: Date;
  name: string;
  contactNo: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  qualification: string;
  collegeName: string;
  collegeCity: string;
  familyDetails: string;
  aadharCard: string;
  profilePhotoName: string;
}
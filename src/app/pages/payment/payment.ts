import { Component, inject, OnInit, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from '../../core/services/payment/payment-service';
import { IPayment } from '../../core/model/payment-model';
import { DatePipe, NgClass } from '@angular/common';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { UserService } from '../../core/services/user/user-service';
import { MasterService } from '../../core/services/master/master-service';
import { IEnrollment } from '../../core/model/enrollment-model';
import { IMaster } from '../../core/model/master-model';
import { EnrollmentService } from '../../core/services/enrollment/enrollment-service';
import { StudentService } from '../../core/services/student/student-service';
import { IStudent } from '../../core/model/student-model';

@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule, AlertBox, DatePipe, NgClass],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class Payment implements OnInit {
  paymentService = inject(PaymentService);
  userService = inject(UserService);
  masterService = inject(MasterService);
  enrollmentService = inject(EnrollmentService);
  studentService = inject(StudentService);

  paymentList = signal<IPayment[]>([]);
  enrollmentList = signal<IEnrollment[]>([]);
  masterPaymentModeList = signal<IMaster[]>([]);
  studentList = signal<IStudent[]>([]);

  isPaymentLoading = signal<boolean>(false);
  isAddUpdatePaymentLoader = signal<boolean>(false);
  isAddPaymentLoader = signal<boolean>(false);

  paymentForm!: FormGroup;
  fb = inject(FormBuilder);

  // data related to alert box - showing on ADD/UPDATE - SUCCESS/ERROR
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});
  isShowAlert = signal<boolean>(false);

  constructor() {
    // get roles userService, if not available, then set in userService.
    if (!Object.keys(this.userService.loggedInUser()).length) {
      this.userService.getLoggedInUser();
    }

    // initialize payment form
    this.paymentForm = this.fb.group({
      paymentId: [0],
      enrollmentId: [0, Validators.required],
      paymentAmount: [0, [Validators.required, Validators.min(1)]],
      receivedByUserId: [this.userService.loggedInUser().userId],
      paymentModeId: [0, Validators.required],
      paymentDate: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInstituteEnrollments();
    this.getMasterPaymentModes();
    this.getInstituteStudents();
    this.getAllPayments();
  }

  getInstituteStudents() {
    let id = this.userService.loggedInUser().instituteId;
    this.studentService.getStudentByInstitute(id).subscribe({
      next: (res: any) => {
        this.studentList.set(res.data);
      },
      error: (err: any) => {
        console.log('Error while fetching students', err);
      }
    });
  }

  /**
   * Get institute enrollments
   */
  getInstituteEnrollments() {
    let id = this.userService.loggedInUser().instituteId;
    this.enrollmentService.getPendingEnrollments(id).subscribe({
      next: (res: any) => {
        res.data.map((enrll: IEnrollment) => {
          enrll.enrollmentName = enrll.studentName + ', ' + enrll?.courseName;
          return enrll;
        });
        this.enrollmentList.set(res.data);
      },
      error: (err: any) => {
        console.log('Error while fetching enrollments', err);
      }
    });
  }

  /**
   * Get master payment modes
   */
  getMasterPaymentModes() {
    this.masterService.getMasterByType('Payment Mode').subscribe({
      next: (res: any) => {
        this.masterPaymentModeList.set(res.data);
      },
      error: (err: any) => {
        console.log('Error while fetching payment modes', err);
      }
    });
  }

  /**
   *  On payment fetch success
   * @param res 
   */
  onPaymentSuccess(res: any) {
    // res.data.map((payment: IPayment) => {
    //   const payMode = this.masterPaymentModeList().find((mode: IMaster) => mode.masterId === payment.paymentModeId);
    //   payment.paymentModeName = payMode ? payMode.masterValue : 'N/A';

    //   return payment;
    // });

    this.paymentList.set(res.data);
  }

  /**
   * Get all payments
   */
  getAllPayments() {
    let id = this.userService.loggedInUser().instituteId;
    this.isPaymentLoading.set(true);
    this.paymentService.getAllPayments(id).subscribe({
      next: (res: any) => {
        this.isPaymentLoading.set(false);
        this.onPaymentSuccess(res);
      },
      error: (err: any) => {
        this.isPaymentLoading.set(false);
        console.log('Error while fetching payments', err);
      }
    });
  }

  onAddEditPaymentSuccess(res: any) {
    console.log('Payment add/edit success response:', res);
    this.isAddPaymentLoader.set(false);
    // Update the branch list
    this.closeModal();
    this.getAllPayments();

    // TO DO  - handle this later
    // this.paymentList.update(list => {
    //   const index = list.findIndex(b => b.paymentId === res.data.paymentId);
    //   if (index === -1) {
    //     return [...list, res.data];
    //   } else {
    //     list[index] = res.data;
    //     return [...list];
    //   }
    // })
    // reset form
    this.paymentForm.reset();
  }

  createPayment() {
    if (this.paymentForm.invalid) {
      return;
    }

    //  set receivedByUserId based on selected enrollment in form using student list and enrollment list
    this.enrollmentList().forEach((enrollment: IEnrollment) => {
      const student = this.studentList().find((stud: IStudent) => stud.name === enrollment.studentName);
      if (enrollment.enrollmentId === this.paymentForm.get('enrollmentId')?.value && student) {
        this.paymentForm.patchValue({
          receivedByUserId: student.studentId
        });
      }
    });

    // format date to yyyy-MM-dd and convert ids which are in string to number
    this.paymentForm.patchValue({
      paymentDate: new Date(this.paymentForm.value.paymentDate).toISOString().split('T')[0],
      enrollmentId: Number(this.paymentForm.value.enrollmentId),
      paymentModeId: Number(this.paymentForm.value.paymentModeId)
    })

    this.isAddPaymentLoader.set(true);
    this.paymentService.createPayment(this.paymentForm.value).subscribe({
      next: (res: any) => {
        this.onAddEditPaymentSuccess(res);
      },
      error: (err: any) => {
        this.isAddPaymentLoader.set(false);
        console.log('Error while creating payment', err);
        // show error alert

        this.isShowAlert.set(true);
        this.isSuccessAlert.set(false);
      }
    });
  }

  cancelEdit() {

  }

  /**
   * Close bootstrap modal with id 'paymentModal' programmatically.
   */
  private closeModal() {
    const modalEl = document.getElementById('paymentModal');
    if (!modalEl) return;
    const bootstrap = (window as any).bootstrap;
    if (bootstrap && bootstrap.Modal) {
      const inst = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      inst.hide();
      return;
    }
    // fallback: click close button if modal API not found
    const closeBtn = modalEl.querySelector('.btn-close') as HTMLElement | null;
    closeBtn?.click();
  }

}

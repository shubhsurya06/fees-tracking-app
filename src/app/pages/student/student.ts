import { Component, OnInit, Output, inject, signal } from '@angular/core';
import { ICourses } from '../../core/model/course-model';
import { CourseService } from '../../core/services/course/course-service';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { DatePipe, NgClass } from '@angular/common';
import { UserService } from '../../core/services/user/user-service';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IInstituteModel } from '../../core/model/institute-model';
import { CommonService } from '../../core/services/common/common-service';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';
import { IStudent } from '../../core/model/student-model';
import { StudentService } from '../../core/services/student/student-service';

@Component({
  selector: 'app-student',
  imports: [AlertBox],
  templateUrl: './student.html',
  styleUrl: './student.scss'
})
export class Student implements OnInit {
  isShowAlert = signal<boolean>(false);
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});

  userService = inject(UserService);
  commonService = inject(CommonService);
  studentService = inject(StudentService);
  isStudentListLoading = signal<boolean>(false);
  isAddUpdateLoader = signal<boolean>(false);
  studentList = signal<IStudent[]>([]);
  instituteAdminRole = APP_CONSTANT.USER_ROLES.INSTITUTE_ADMIN;
  instituteList = signal<IInstituteModel[]>([]);
  studentForm!: FormGroup;
  isAddEditStudentLoader = signal<boolean>(false);


  constructor() {
    if (!Object.keys(this.userService.loggedInUser()).length) {
      this.userService.getLoggedInUser();
    }
  }

  ngOnInit(): void {
    this.getStudentByInstitute();
  }

  /**
   * get all students from commonService on page load
   */
  async getStudentByInstitute() {
    let instituteId: number | undefined = this.userService.loggedInUser().instituteId;

    let id = this.userService.loggedInUser().instituteId;

    this.isStudentListLoading.set(true);
    this.studentService.getStudentByInstitute(id).subscribe({
      next: (res: any) => {
        this.isStudentListLoading.set(false);
        this.studentList.set(res.data);
        console.log('getting all studnet list:', res);
      }, error: (error: any) => {
        console.log('Error  while  getting all student  enrollmentslist:', error);
      }
    })
  }

  editStudent(student: IStudent) {
    
  }

  deleteStudent(id: number) {

  }
}

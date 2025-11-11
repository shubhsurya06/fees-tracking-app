import { Injectable, inject, signal } from '@angular/core';
import { InstituteService } from '../institute/institute-service';
import { IInstituteModel } from '../../model/institute-model';
import { IStudent } from '../../model/student-model';
import { StudentService } from '../student/student-service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  instituteList = signal<IInstituteModel[]>([]);
  studentList = signal<IStudent[]>([]);

  instituteService = inject(InstituteService);
  studentService = inject(StudentService);

  /**
   * return all instituteList if avaialble, else, fetch data from API, then return
   * @returns instituteList[]
   */
  async returnAllInstitute() {
    if (!this.instituteList().length) {
      await this.getAllInstitute();
    }
    return this.instituteList();
  }

  /**
   * return all studentList if avaialble, else, fetch data from API, then return
   * @returns studentList[]
   */
  async returnAllStudents(instituteId: number | undefined) {
    if (!this.studentList().length) {
      await this.getStudentByInstitute(instituteId);
    }
    return this.studentList();
  }

  /**
   * call api to get insitituteLit and set data in institute signal
   * @returns 
   */
  async getAllInstitute() {
    return new Promise((resolve, reject) => {
      this.instituteService.getAllInstitutes().subscribe({
        next: (res: any) => {
          this.instituteList.set(res.data);
          resolve(true);
        },
        error: (err: any) => {
          console.log('common-service.ts::getAllInstitues::error::API error::', err);
        }
      })
    })
  }

  /*
  * call api to get studentList by institute and set data in student signal 
  * @returns 
  */
  async getStudentByInstitute(instituteId: number | undefined) {
    return new Promise((resolve, reject) => {
      this.studentService.getStudentByInstitute(instituteId).subscribe({
        next: (res: any) => {
          this.studentList.set(res.data);
          resolve(true);
        },
        error: (err: any) => {
          console.log('common-service.ts::getStudentByInstitute::error::API error::', err);
        }
      })
    })
  }

}

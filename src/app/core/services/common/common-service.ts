import { Injectable, inject, signal } from '@angular/core';
import { InstituteService } from '../institute/institute-service';
import { IInstituteModel } from '../../model/institute-model';
import { IStudent } from '../../model/student-model';
import { StudentService } from '../student/student-service';
import { APP_CONSTANT } from '../../constant/appConstant';
import { IPagination } from '../../model/pagination-model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  instituteList = signal<IInstituteModel[]>([]);
  studentList = signal<IStudent[]>([]);

  instituteService = inject(InstituteService);
  studentService = inject(StudentService);

  /**
   heights of overall screen, navbar, top-header content on each component
   * */ 
  constantHeights = signal<any>(APP_CONSTANT.SCREEN_HEIGHTS);

  /**
   * this is pagination data, with pageSize = 8
   */
  pagination: IPagination = {
    totalRecords: 0,
    totalPages: 0,
    pageNumbers: []
  };

  /**
   * calculate remaining listViewPort height in which we will show list-card
   * after subtracting navbar, each components inside header and pagination height
   * @returns 
   */
  currentViewportHeight(num: number = 0) {
    const { VIEWPORT_HEIGHT, NAVBAR_HEIGHT, INSIDE_HEADER_HEIGHT, PAGINATION_HEIGHT } = this.constantHeights();
    return `${VIEWPORT_HEIGHT - (NAVBAR_HEIGHT + INSIDE_HEADER_HEIGHT + PAGINATION_HEIGHT + num)}px`;
  }

  /**
   * Set pagination data for each component by taking list.length argument
   * @param length 
   * @returns 
   */
  setPaginationData(length: number) {
    this.pagination.totalRecords = length;
    this.pagination.totalPages = Math.ceil(this.pagination.totalRecords / APP_CONSTANT.PAGE_SIZE);
    this.pagination.pageNumbers = Array.from({ length: this.pagination.totalPages }, (_, i) => i + 1);

    return this.pagination;
  }

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

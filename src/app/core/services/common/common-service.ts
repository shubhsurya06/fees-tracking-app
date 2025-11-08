import { Injectable, inject, signal } from '@angular/core';
import { InstituteService } from '../institute/institute-service';
import { IInstituteModel } from '../../model/institute-model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  instituteList = signal<IInstituteModel[]>([]);

  instituteService = inject(InstituteService);

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

}

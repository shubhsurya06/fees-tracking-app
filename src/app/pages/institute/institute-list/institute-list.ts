import { Component, OnInit, inject, signal } from '@angular/core';
import { Header } from '../../header/header'
import { Router, ActivatedRoute } from '@angular/router';
import { InstituteService } from '../../../core/services/institute/institute-service';
import { IInstituteModel } from '../../../core/model/institute-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-institute-list',
  imports: [Header, DatePipe],
  templateUrl: './institute-list.html',
  styleUrl: './institute-list.scss'
})
export class InstituteList implements OnInit {

  router = inject(Router);
  route = inject(ActivatedRoute);
  instituteService = inject(InstituteService);
  instituteList = signal<IInstituteModel[]>([]);
  isInstituteLoader = signal<boolean>(false);

  constructor() {
  }

  ngOnInit(): void {
    console.log('hello, institute list loaded');
    this.getAllInstitutes();
  }

  // navigate to add/edit institute form
  addEditInstitute(id: number | string | undefined) {
    id = id && id.toString();
    this.router.navigate(['/institute', id]);
  }

  // get all institutes from service
  getAllInstitutes() {
    this.isInstituteLoader.set(true);
    this.instituteService.getAllInstitutes().subscribe({
      next: (res: any) => {
        this.isInstituteLoader.set(false);
        this.instituteList.set(res.data.splice(1));
      },
      error: (error) => {
        this.isInstituteLoader.set(false);
        alert(error.message);
      }
    })
  }

  // delete institute by id
  deleteInstitute(id: number | undefined) {
    console.log('Delete institute with ID:', id);
    this.instituteService.deleteInstitute(id).subscribe({
      next: (res: any) => {
        let updatedList = this.instituteList().filter(institute => institute.instituteId !== id);
        this.instituteList.set(updatedList);
      },
      error: (error: any) => {
        alert(error.message);
      }
    })
  }
}

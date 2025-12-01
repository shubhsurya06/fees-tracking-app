import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InstituteService } from '../../../core/services/institute/institute-service';
import { IInstituteModel } from '../../../core/model/institute-model';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { IPagination } from '../../../core/model/pagination-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-institute-list',
  imports: [DatePipe, FormsModule],
  templateUrl: './institute-list.html',
  styleUrl: './institute-list.scss'
})
export class InstituteList implements OnInit {

  router = inject(Router);
  route = inject(ActivatedRoute);
  instituteService = inject(InstituteService);
  instituteList = signal<IInstituteModel[]>([]);
  isInstituteLoader = signal<boolean>(false);

  searchText: string = '';
  searchSubject = new Subject<string>();
  subscription!: Subscription;
  filteredSearchText = signal<string>('');

  // pagination data
  pagination: IPagination = {
    totalRecords: 0,
    totalPages: 0,
    pageNumbers: []
  };
  currentPageNo = signal<number>(1);

  constructor() {
  }

  ngOnInit(): void {
    this.subscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe({
      next: (search) => {
        this.filteredSearchText.set(search);
      }
    })

    this.getAllInstitutes();
  }

  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  // navigate to add/edit institute form
  addEditInstitute(id: number | string | undefined) {
    id = id && id.toString();
    this.router.navigate(['/institute/form', id]);
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

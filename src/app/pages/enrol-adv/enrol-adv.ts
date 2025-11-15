import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-enrol-adv', 
  imports: [CommonModule, FormsModule],
  templateUrl: './enrol-adv.html',
  styleUrls: ['./enrol-adv.scss']
})
export class EnrolAdv  implements OnInit{
  filter = {
    studentId: 0,
    courseId: 0,
    fromDate: "",
    toDate: "",
    pageNumber: 1,
    pageSize: 5,
    sortBy: "",
    sortDirection: ""
  }

  enrollments: any[] = [];
  totalRecords: number = 0;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);

  filteredEnrollments = [...this.enrollments];


  ngOnInit(): void {
    this.getEnrollmentNByFilter();
  }

  addSorintField(key:string) {
    this.filter.sortBy = key;
    this.filter.sortDirection = 'asc';
    this.getEnrollmentNByFilter();
  }

  getEnrollmentNByFilter() {
    this.http.post("https://localhost:7030/api/Enrollments/filterEnrollmentsPaged",this.filter).subscribe({
      next:(result:any)=>{
        this.enrollments = result.data;
        this.totalRecords = result.totalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.filter.pageSize);
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.cdr.detectChanges();
      },
      error:(error:any)=>{
        console.error('Error fetching enrollments:', error);
      }
    })
  }

 
  applyFilter() {
    this.filter.pageNumber = 1;
    this.getEnrollmentNByFilter();
  }

  goToPage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.filter.pageNumber = pageNumber;
      this.getEnrollmentNByFilter();
    }
  }

  clearFilters() {
    this.filter = { studentId: 0, courseId: 0, fromDate: '', toDate: '', pageNumber: 1, pageSize: 5, sortBy: '', sortDirection: '' };
    this.filteredEnrollments = [...this.enrollments];
  }

}

import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InstituteService } from '../../../core/services/institute/institute-service';
import { IInstituteModel } from '../../../core/model/institute-model';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-institute-form',
  imports: [FormsModule, NgClass, NgIf],
  templateUrl: './institute-form.html',
  styleUrl: './institute-form.scss'
})
export class InstituteForm implements OnInit {

  router = inject(Router);
  route = inject(ActivatedRoute);
  instituteService = inject(InstituteService);
  isLoadingSingleInstitute = signal<boolean>(false);
  isAddEditInstituteLoader = signal<boolean>(false);

  // set template driven form
  instituteFormData: IInstituteModel = {
    name: '',
    ownerName: '',
    conatctNo: '',
    emailId: '',
    city: '',
    state: '',
    pincode: '',
    location: '',
    gstNo: ''
  };

  id: string | null = null;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      console.log('Institute ID:', this.id);
    })
  }

  ngOnInit(): void {
    console.log('hello, institute form loaded');
    this.loadInstituteData();
  }

  // load institute data if id is available and open edit-institute form, else open add-institute form
  loadInstituteData() {
    if (this.id == "0") {
      return;
    }
    this.isLoadingSingleInstitute.set(true);
    if (this.id) {
      this.instituteService.getInstituteDetails(this.id).subscribe({
        next: (res: any) => {
          console.log('Institute details:', res.data);
          this.isLoadingSingleInstitute.set(false);
          this.instituteFormData = res.data;
        }, error: (error: any) => {
          this.isLoadingSingleInstitute.set(false);
          alert(error.message);
        }
      });
    }
  }

  // perform actions when ADD/UPDATE activities are done
  onAddUpdateInstitute() {
    this.isAddEditInstituteLoader.set(false);
    this.router.navigate(['/institute']);
  }

  // update institute from here
  updateInstitute() {
    this.instituteService.updateInstitute(this.instituteFormData).subscribe({
      next: (res: any) => {
        this.onAddUpdateInstitute();
        alert('Institute updated successfully');
      },
      error: (error: any) => {
        this.isAddEditInstituteLoader.set(false);
        alert(error.message);
      }
    });
  }

  // Add/Update institute from here after filling all required fields in form
  onSubmit() {
    if (!this.instituteFormData) {
      return;
    }

    if (!this.instituteFormData.name || !this.instituteFormData.ownerName || !this.instituteFormData.conatctNo ||
        !this.instituteFormData.emailId || !this.instituteFormData.city || !this.instituteFormData.state ||
        !this.instituteFormData.pincode || !this.instituteFormData.location || !this.instituteFormData.gstNo) {
      alert('Please fill all required fields.');
      return;
    }

    this.isAddEditInstituteLoader.set(true);

    if (this.id != '0') {
      // Update existing institute
      this.updateInstitute();
    } else {
      // Create new institute
      this.instituteService.createInstitute(this.instituteFormData).subscribe({
        next: (res: any) => {
          alert('Institute created successfully');
          this.onAddUpdateInstitute();
        },
        error: (error: any) => {
          this.isAddEditInstituteLoader.set(false);
          alert(error.message);
        }
      });
    }
  }

  // if user don't want to edit/update form, then show alert and redirect user to institute-listing  page
  cancelEdit() {
    let flag = confirm('Are you sure you want to cancel Institute Update?')
    if (flag) {
      this.router.navigate(['/institute']);
    }
  }
}

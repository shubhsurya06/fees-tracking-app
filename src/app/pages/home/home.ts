import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IInstituteModel } from '../../core/model/institute-model';
import { InstituteService } from '../../core/services/institute/institute-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  isAddRegLoader = signal<boolean>(false);
  isInstituteReg = signal<boolean>(false);
  registerForm!: FormGroup;
  instituteService = inject(InstituteService);

  constructor(private readonly fb: FormBuilder) {
    this.registerForm = this.fb.group({
      instituteId: [0],
      name: ['', [Validators.required]],
      conatctNo: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      state: ['', [Validators.required]],
      location: ['', [Validators.required]],
      ownerName: ['', [Validators.required]],
      createdDate: [new Date()],
      gstNo: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {

  }

  get instForm() {
    return this.registerForm.controls;
  }

  registerInstitute() {
    console.log('form data:', this.registerForm.value);
    if (this.registerForm.invalid) {
      // alert('Please check all fields in form and try again.');
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isAddRegLoader.set(true);

    let instituteData: IInstituteModel = this.registerForm.value;

    console.log('institute data:', instituteData)

    // Create new institute
    this.instituteService.createInstitute(instituteData).subscribe({
      next: (res: any) => {
        this.isAddRegLoader.set(false);
        this.isInstituteReg.set(true);
        alert('Institute created successfully');
        this.registerForm.reset();

        setTimeout(() => {
          this.isInstituteReg.set(false);
        }, 5000);
      },
      error: (error: any) => {
        this.isAddRegLoader.set(false);
        alert(error.message);
      }
    });

  }

}

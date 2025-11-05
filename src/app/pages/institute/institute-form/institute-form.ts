import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../header/header';
import { Router, ActivatedRoute } from '@angular/router';
import { InstituteService } from '../../../core/services/institute/institute-service';

@Component({
  selector: 'app-institute-form',
  imports: [Header],
  templateUrl: './institute-form.html',
  styleUrl: './institute-form.scss'
})
export class InstituteForm implements OnInit {

  router = inject(Router);
  route = inject(ActivatedRoute);
  instituteService = inject(InstituteService);

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

  loadInstituteData() {
    if (this.id) {
      this.instituteService.getInstituteDetails(this.id).subscribe({
        next: (res: any) => {
          console.log('Institute details:', res.data);
        }, error: (error: any) => {
          alert(error.message);
        }
      });
    }
  }

}

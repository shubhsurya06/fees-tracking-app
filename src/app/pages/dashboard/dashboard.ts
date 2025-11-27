import { Component, signal, inject, OnInit } from '@angular/core';
import { MasterActions } from '../../store/master/actions';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IMaster } from '../../core/model/master-model';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit{
  title = signal('Dashboard Page Title');

  masterStore = inject(Store);

  constructor() {

  }

  ngOnInit(): void {
    this.masterStore.dispatch(MasterActions.loadMastersByType({ isForMaster: 'Payment Mode' }));
    this.masterStore.dispatch(MasterActions.loadMastersByType({ isForMaster: 'Reference By' }));
  }

}

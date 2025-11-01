import { Component, signal } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'app-dashboard',
  imports: [Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  title = signal('Dashboard Page Title');
}

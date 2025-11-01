import { Component, signal } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'app-master',
  imports: [Header],
  templateUrl: './master.html',
  styleUrl: './master.scss'
})
export class Master {

  title = signal('Master Page Title');

  constructor() { }

}

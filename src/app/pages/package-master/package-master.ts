import { Component, signal } from '@angular/core';
import { Header } from '../header/header';

@Component({
  selector: 'app-package-master',
  imports: [Header],
  templateUrl: './package-master.html',
  styleUrl: './package-master.scss'
})
export class PackageMaster {
  title = signal('Pacakge Master Page Title');
}

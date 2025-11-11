import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './pages/header/header';
import { AuthService } from './core/services/auth/auth-service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('fees-tracking-app');
  authService = inject(AuthService);
  isLoggedId = signal<boolean>(false);

  ngOnInit(): void {
    this.authService.loggedInSubject.subscribe({
      next: (flag: boolean) => {
        this.isLoggedId.set(flag);
      }, error: (err: any) => {
        console.log('Error while logged in');
      }
    })
  }

}

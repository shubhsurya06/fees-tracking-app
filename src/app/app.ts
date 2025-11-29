import { Component, signal, inject, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './pages/header/header';
import { AuthService } from './core/services/auth/auth-service';
import { NgIf } from '@angular/common';
import { APP_CONSTANT } from './core/constant/appConstant';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('fees-tracking-app');
  authService = inject(AuthService);

  ngAfterViewInit(): void {
    APP_CONSTANT.SCREEN_HEIGHTS.VIEWPORT_HEIGHT = window.innerHeight;
  }

  
}

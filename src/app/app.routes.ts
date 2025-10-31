import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Master } from './pages/master/master';
import { authGuard } from './core/auth/auth-guard';
import { PackageMaster } from './core/auth/pages/package-master/package-master';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login, title: 'User Login' },
    { path: 'master', component: Master, title: 'Master Page', canActivate: [authGuard] },
    { path: 'package-master', component: PackageMaster, title: 'Package Master Page', canActivate: [authGuard] },
];

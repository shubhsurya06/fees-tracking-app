import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Master } from './pages/master/master';
import { authGuard } from './core/services/auth/auth-guard';
import { PackageMaster } from './pages/package-master/package-master';
import { Dashboard } from './pages/dashboard/dashboard';
import { Branch } from './pages/branch/branch';
import { Courses } from './pages/courses/courses';
import { roleCheckGuard } from './core/services/auth/role-check-guard';
import { RoleError } from './pages/role-error/role-error';
import { Activation } from './pages/activation/activation';
import { Home } from './pages/home/home';
import { EnrolAdv } from './pages/enrol-adv/enrol-adv';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home, title: 'Fees-Tracking' },
    { path: 'login', component: Login, title: 'Login | Fees Tracking App' },
    { path: 'roleerror', component: RoleError, title: 'Login | Fees Tracking App' }, 
    { path: 'dashboard', component: Dashboard, title: 'Dashboard | Fees Tracking App', canActivate: [authGuard,roleCheckGuard] },
    { path: 'master', component: Master, title: 'Master | Fees Tracking App', canActivate: [authGuard,roleCheckGuard] },
    { path: 'package-master', component: PackageMaster, title: 'Package Master | Fees Tracking App', canActivate: [authGuard,roleCheckGuard] },
    { path: 'activation', component: Activation, title: 'Activation | Fees Tracking App', canActivate: [authGuard,roleCheckGuard] },
    {
        path: 'institute',
        loadChildren: () =>
            import('../app/pages/institute/institute.routes').then((m) => m.INSTITUTE_ROUTES),
        canActivate: [authGuard,roleCheckGuard]
    },
    // { path: 'branch', component: Branch, title: 'Branch | Fees Tracking app', canActivate: [authGuard] },
    // { path: 'course', component: Courses, title: 'Course | Fees Tracking app', canActivate: [authGuard] },
];

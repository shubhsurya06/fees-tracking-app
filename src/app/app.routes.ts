import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Master } from './pages/master/master';
import { authGuard } from './core/services/auth/auth-guard';
import { PackageMaster } from './pages/package-master/package-master';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login, title: 'User Login' },
    { path: 'dashboard', component: Dashboard, title: 'Dashboard | Fees Tracking App', canActivate: [authGuard] },
    { path: 'master', component: Master, title: 'Master Page', canActivate: [authGuard] },
    { path: 'package-master', component: PackageMaster, title: 'Package Master Page', canActivate: [authGuard] },
    {
        path: 'institute',
        loadChildren: () =>
            import('../app/pages/institute/institute.routes').then((m) => m.INSTITUTE_ROUTES),
        canActivate: [authGuard]
    }
];

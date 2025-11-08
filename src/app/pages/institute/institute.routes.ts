import { Route } from "@angular/router";
import { InstituteForm } from "./institute-form/institute-form";
import { InstituteList } from "./institute-list/institute-list";

export const INSTITUTE_ROUTES: Route[] = [
    { path: '', redirectTo: 'list', pathMatch: 'full'},
    { path: 'list', component: InstituteList, title: 'Institute List:Fees Tracking App'},
    { path: 'form/:id', component: InstituteForm, title: 'Institute Form:Fees Tracking App'}
]
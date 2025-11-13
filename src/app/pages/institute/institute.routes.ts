import { Route } from "@angular/router";
import { InstituteForm } from "./institute-form/institute-form";
import { InstituteList } from "./institute-list/institute-list";
import { Courses } from "../courses/courses";
import { Branch } from "../branch/branch";
import { Enrollment } from "../enrollment/enrollment";
import { Payment } from "../payment/payment";

export const INSTITUTE_ROUTES: Route[] = [
    { path: '', redirectTo: 'list', pathMatch: 'full'},
    { path: 'list', component: InstituteList, title: 'Institute List | Fees Tracking App'},
    { path: 'form/:id', component: InstituteForm, title: 'Institute Form | Fees Tracking App'},
    { path: 'branch', component: Branch, title: 'Institute Branch | Fees Tracking App'},
    { path: 'course', component: Courses, title: 'Institute Course | Fees Tracking App'},
    { path: 'enrollment', component: Enrollment, title: 'Institute Enrollments | Fees Tracking App'},
    { path: 'payment', component: Payment, title: 'Institute Payments | Fees Tracking App'},
]
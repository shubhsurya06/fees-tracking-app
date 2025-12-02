export const role_allowed_routes = [
    { path: 'institute/list', rolesAllowed: ['InstituteAdmin','SuperAdmin'] },
    { path: 'institute/form/:id', rolesAllowed: ['SuperAdmin'] },
    { path: 'institute/branch', rolesAllowed: ['InstituteAdmin'] },
    { path: 'institute/course', rolesAllowed: ['InstituteAdmin'] },
    { path: 'institute/enrollment', rolesAllowed: ['InstituteAdmin'] },
    { path: 'institute/payment', rolesAllowed: ['InstituteAdmin'] },
    { path: 'institute/student', rolesAllowed: ['InstituteAdmin'] },
    { path: 'dashboard', rolesAllowed: ['SuperAdmin', 'InstituteAdmin'] },
    { path: 'master', rolesAllowed: ['SuperAdmin'] },
    { path: 'package-master', rolesAllowed: ['SuperAdmin'] },
    { path: 'activation', rolesAllowed: ['SuperAdmin'] },
    { path: 'institute/enrollist', rolesAllowed: ['InstituteAdmin'] },
]
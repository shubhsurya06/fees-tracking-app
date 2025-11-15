export const API_CONSTANT = {
    CONTROLLER_TYPES: {
        MASTER: 'Master',
        USER: 'User',
        PACKAGE_MASTER: 'PackageMaster',
        INSTITUTE: 'InstituteMaster',
        BRANCH: 'BranchMaster',
        COURSE: 'Course',
        ENROLLMENT: 'Enrollments',
        STUDENT: 'Student',
        PAYMENT: 'Payments',
        ACTIVATION: 'Activations'
    },
    MASTER_APIS: {
        GET_ALL_MASTER: '/get-all-masters',
        CREATE_MASTER: '/create-master',
        UPDATE_MASTER: '/update-master',
        DELETE_MASTER: '/delete-master',
        GET_MASTER_BY_TYPE: '/get-masters-by-type'
    },
    PACKAGE_MASTER_APIS: {
        GET_ALL_PACKAGES: '/get-all-packages',
        CREATE_PACKAGE: '/create-package',
        DELETE_PACKAGE: '/delete-package',
        UPDATE_PACKAGE: '/update-package',
        GET_SINGLE_PACKAGE: '/get-package-by-id'
    },
    INSTITUTE_APIS: {
        GET_ALL_INSTITUTES: '/get-all-institutes',
        CREATE_INSTITUTE: '/create-institute',
        UPDATE_INSTITUTE: '/update-institute',
        DELETE_INSTITUTE: '/delete-institute',
        GET_SINGLE_INSTITUTE: '/get-institute-by-id'
    },
    BRANCH_APIS: {
        GET_ALL_BRANCHES: '/get-all-branches',
        CREATE_BRANCH: '/create-branch',
        UPDATE_BRANCH: '/update-branch',
        DELETE_BRANCH: '/delete-branch',
        GET_SINGLE_BRANCH: '/get-branch-by-id'
    },
    COURSE_APIS: {
        GET_ALL_COURSES: '/getAllCourses',
        CREATE_COURSES: '/createCourse',
        UPDATE_COURSES: '/updateCourse',
        DELETE_COURSES: '/deleteCourse'
    },
    ENROLLMENT_APIS: {
        GET_ALL_ENROLLMENT: '/getAllEnrollments',
        GET_ENROLLMENT_BY_ID: '/getAllEnrollmentById',
        CREATE_ENROLLMENT: '/createStudentEnrollment',
        UPDATE_ENROLLMENT: '/updateEnrollment',
        DELETE_ENROLLMENT: '/deleteEnrollment',
        FILTER_ENROLLMENTS: '/filterEnrollments'
    },
    PAYMENT_APIS: {
        GET_ALL_PAYMENTS: '/getAllPaymentsByInstituteId',
        GET_PAYMENT_BY_ID: '/getPaymentById',
        CREATE_PAYMENT: '/createPayment',
        UPDATE_PAYMENT: '/updatePayment',
        DELETE_PAYMENT: '/deletePayment',
        FILTER_PAYMENTS: '/filterPayments'
    },
    ACTIVATION_APIS: {
        CREATE_ACTIVATION: '/create-activation',
        GET_ALL_ACTIVATION: '/get-all-activations',
        UPDATE_ACTIVATION: '/update-activation',
        DELETE_ACTIVATION: '/delete-activation',
        GET_ACTIVATION_BY_ID: '/get-activation-by-id'
    },
    STUDENT_APIS: {
        GET_STUDENT_BY_INSTITUTE: '/institute'
    },
    USER_APIS: {
        LOGIN: '/login',
    }
}
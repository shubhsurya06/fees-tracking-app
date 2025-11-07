export const ApiConstant = {
    CONTROLLER_TYPES: {
        MASTER: 'Master',
        USER: 'User',
        PACKAGE_MASTER: 'PackageMaster',
        INSTITUTE: 'InstituteMaster',
        BRANCH: 'BranchMaster'
    },
    SLASH_CONST: '/',
    ALERT_CONSTANT: {
        TYPE: {
            SUCCESS: 'alert-success',
            DANGER: 'alert-danger'
        },
        TITLE: {
            SUCCESS: 'SUCCESS!',
            DANGER: 'DANGER'
        }
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
    USER_APIS: {
        LOGIN: '/login',
    }
}
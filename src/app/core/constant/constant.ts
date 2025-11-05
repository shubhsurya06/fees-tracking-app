export const ApiConstant = {
    CONTROLLER_TYPES: {
        MASTER: 'Master',
        USER: 'User',
        PACKAGE_MASTER: 'PackageMaster'
    },
    SLASH_CONST: '/',
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
    USER_APIS: {
        LOGIN: '/login',
    }
}
export enum USER_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED',
    DELETED = 'DELETED',
    PENDING = 'PENDING',
    SUSPENDED = 'SUSPENDED',
    BLOCKED = 'BLOCKED'
}
export enum USER_ROLE {
    GUEST = 'GUEST',
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPERVISER = 'SUPERVISER',
    MANAGER = 'MANAGER',
    SUPERADMIN = 'SUPERADMIN',
}
export const METADATA_KEYS = {
    CRONJOB: Symbol('cronSchedule'),
    FILE_UPLOAD_OPTIONS: Symbol('fileUploadOptions'),
    ABILITY: Symbol('ability')

}
export const RolesArray = Object.values(USER_ROLE);
export enum AbitlityActions {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}
export type Actions = 'create' | 'read' | 'update' | 'delete';

export const USER_STATUS_AND_ERROR = {
    [USER_STATUS.INACTIVE]: "Your Account is Not Active,Please Verify Your Email",
    [USER_STATUS.BANNED]: "Your Account is Banned,Please Contact Administrator",
    [USER_STATUS.DELETED]: "No Account With This Email Found",
    [USER_STATUS.PENDING]: "Your Account is Pending,Please Wait For Approval",
    [USER_STATUS.SUSPENDED]: "Your Account is Suspended,Due to violation of Terms and Conditions",
    [USER_STATUS.BLOCKED]: "Your Account is Blocked,Due to Many Failed Login Attempts",
}
export const RoleWithPermissions = {
    roles: [
        {
            name: USER_ROLE.SUPERADMIN,
            permissions: [
                "create",
                "read",
                "update",
                "delete"
            ]
        },
        {
            name: USER_ROLE.ADMIN,
            permissions: [
                "create",
                "read",
                "update"
            ]
        },
        {
            name: USER_ROLE.MANAGER,
            permissions: [
                "create",
                "read"
            ]
        }
    ]
}

import { RoleWithPermissions } from "./constants";

export class RoleAndPermissions {
  private permissions: string[];
  private roles: { name: string; permissions: string[] }[];
  constructor() {
    this.roles = RoleWithPermissions.roles;
    this.permissions = [];
  }

  getRoleByName(name:string) {
    return this.roles.find((role) => role.name === name);
  }

  getRoles() {
    return this.roles;
  }
  getPermissionsByRoleName(name:string) {
    const role = this.getRoleByName(name);
    return role ? role.permissions : [];
  }
}




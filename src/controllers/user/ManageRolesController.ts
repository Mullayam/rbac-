import type { Request, Response } from "express";
import { InjectRepository } from "@/factory/typeorm";
import { RacMapEntity } from "@/factory/entities/racmap.entity";
import { TenantUsersEntity } from "@/factory/entities/tenant_users.entity";
import { RolesEntity } from "@/factory/entities/roles.entity";

class ManageRolesController {

    async assignRole(req: Request, res: Response) {
        try {
            const { tenant_userId, roleId } = req.body;
            const roleInstance = new RolesEntity()
            roleInstance.id = roleId;
            const assignRole = await InjectRepository(TenantUsersEntity).update({
                id: tenant_userId
            }, {
                role() {
                    return roleId
                },
            })
            return res.json({ message: "OK", result: assignRole.affected, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async unAssignRole(req: Request, res: Response) {
        try {
            const { tenant_userId } = req.body;

            const assignRole = await InjectRepository(TenantUsersEntity).update({
                id: tenant_userId
            }, {
                role() {
                    return "null"
                }
            })
            return res.json({ message: "OK", result: assignRole.affected, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async editPrivillegeOfModule(req: Request, res: Response) {
        try {
            const racmaps = await InjectRepository(RacMapEntity).find()
            return res.json({ message: "OK", result: racmaps, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
}
export default new ManageRolesController()
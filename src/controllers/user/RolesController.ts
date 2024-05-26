import type { Request, Response } from "express";
import { PrivilegesEntity } from "@/factory/entities/privileges.entity";
import { InjectRepository } from "@/factory/typeorm";
import { RolesEntity } from "@/factory/entities/roles.entity";

class RolesController {

    async find(req: Request, res: Response) {
        try {
            const roles = await InjectRepository(RolesEntity).find()
            return res.json({ message: "Roles Found", result: roles, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async update(req: Request, res: Response) {
        try {
            const { roleId } = req.body
            delete req.body.roleId
            const response = await InjectRepository(RolesEntity).update({ id: roleId }, { ...req.body })

            return res.json({ message: "Role Updated", result: response.affected, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async create(req: Request, res: Response) {
        try {
            const response = await InjectRepository(RolesEntity).save({ ...req.body })

            return res.json({ message: "OK", result: response.id, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async delete(req: Request, res: Response) {
        try {
            await InjectRepository(RolesEntity).delete({ id: req.body.roleId })

            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async getPrivilleges(req: Request, res: Response) {
        try {
            const privilleges = await InjectRepository(PrivilegesEntity).find()
            return res.json({ message: "OK", result: privilleges, success: true })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }

}
export default new RolesController();
import { ModulesEntity } from "@/factory/entities/module.entity";
import { SubModulesEntity } from "@/factory/entities/submodule.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { Request, Response } from "express";

class SubModulesController {

    async find(req: Request, res: Response) {
        try {
            const submodules = await InjectRepository(SubModulesEntity).find()
            return res.json({ message: "Submodules Fetched", result: submodules, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async update(req: Request, res: Response) {
        try {
            const { submodule_name, description, moduleId, submoduleId } = req.body
            const moduleInstance = new ModulesEntity()
            moduleInstance.id = moduleId
            const response = await InjectRepository(SubModulesEntity).update({ id: submoduleId }, {
                submodule_name,
                description,
                parentModule: moduleInstance
            })
            return res.json({ message: "Submodule Updated", result: response.affected, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async create(req: Request, res: Response) {
        try {
            const { submodule_name, description, moduleId } = req.body
            const moduleInstance = new ModulesEntity()
            moduleInstance.id = moduleId
            const response = await InjectRepository(SubModulesEntity).save({
                submodule_name,
                description,
                parentModule: moduleInstance
            })
            return res.json({ message: "SubModule Created", result: response.id, success: true })

        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async delete(req: Request, res: Response) {
        try {
            await InjectRepository(SubModulesEntity).delete({ id: req.body.submoduleId })
            return res.json({ message: "SubModule Deleted", result: null, success: true })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
}
export default new SubModulesController();
import { ModulesEntity } from "@/factory/entities/module.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { Request, Response } from "express";

class ModulesController {

    async find(req: Request, res: Response) {
        try {
            const modules = await InjectRepository(ModulesEntity).find()
            return res.json({ message: "Modules Fetched", result: modules, success: true })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async update(req: Request, res: Response) {
        try {
            const { moduleId } = req.body
             delete req.body.moduleId 
            const response = await InjectRepository(ModulesEntity).update({id: moduleId},{ ...req.body })

            return res.json({ message: "Module Updated", result: response.affected, success: true })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async create(req: Request, res: Response) {
        try {
            const response = await InjectRepository(ModulesEntity).save({ ...req.body })
          
            return res.json({ message: "Module Created", result: response.id, success: true })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async delete(req: Request, res: Response) {
        try {
            await InjectRepository(ModulesEntity).delete({ id: req.body.moduleId })
            return res.json({ message: "Module Deleted", result: null, success: true })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
}
export default new ModulesController();
import { RacMapEntity } from "@/factory/entities/racmap.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { Request, Response } from "express";

class RacmapController {

    async find(req: Request, res: Response) {
        try {
            const racmaps = await InjectRepository(RacMapEntity).find()
            return res.json({ message: "OK", result: racmaps, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }    
    async update(req: Request, res: Response) {
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async create(req: Request, res: Response) {
        try {
            const response = await InjectRepository(RacMapEntity).save({ ...req.body })
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async delete(req: Request, res: Response) {
        try {
            await InjectRepository(RacMapEntity).delete({ id: req.body.racmapId })

            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
}
export default new RacmapController();
import type { Request, Response } from "express";

class RacmapController {

    async findAll(req: Request, res: Response) {
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async findOne(req: Request, res: Response) {
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async updateRole(req: Request, res: Response) {
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async create(req: Request, res: Response) {
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async delete(req: Request, res: Response) {
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
}
export default new RacmapController();
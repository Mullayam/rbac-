import type { Request, Response } from "express";
import { TenantUsersEntity } from "@/factory/entities/tenant_users.entity";
import { InjectRepository } from "@/factory/typeorm";
import { UserReqValidator } from "@/factory/validators/User.request.validator";
import { Validate } from "@/utils/decorators/core.decorator";

class AuthController {
    @Validate(UserReqValidator.login)
    async login(req: Request, res: Response) {
        try {
            const { email, password, type } = req.body
            const user = await InjectRepository(TenantUsersEntity).findOne({ where: { email: email, password: password } }) 
            
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }

    @Validate(UserReqValidator.register)
    async register(req: Request, res: Response) {
        try {
            const { email, password, type } = req.body
            const user = await InjectRepository(TenantUsersEntity).save({ email, password, type }) 
            return res.json({ message: "OK", result: user, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }

    async hello(req: Request, res: Response) {
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async protected(req: Request, res: Response) {
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
}
export default new AuthController()
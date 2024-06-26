import type { Request, Response } from "express";
import { TenantUsersEntity } from "@/factory/entities/tenant_users.entity";
import { InjectRepository } from "@/factory/typeorm";
import { UserReqValidator } from "@/factory/validators/User.request.validator";
import { Validate } from "@/utils/decorators/core.decorator";
import { USER_STATUS, USER_STATUS_AND_ERROR } from "@/utils/helpers/constants";
import utils from "@/utils";

const VALID_ROLES = Object.values(USER_STATUS).slice(1)

class AuthController {
    @Validate(UserReqValidator.login)
    async login(req: Request, res: Response) {
        try {
            const { email, password, type } = req.body

            const user = await InjectRepository(TenantUsersEntity).findOne({ where: { email: email } })
            if (!user) {
                return res.json({ message: "This Email User Does Not Exist", result: null, success: false })
            }
            if (user.status.includes(user.status)) {
                return {
                    success: false,
                    result: null,
                    message: USER_STATUS_AND_ERROR[user.status as keyof typeof USER_STATUS_AND_ERROR],
                }
            }

            if (!utils.ComparePassword(user.password, password)) {
                return res.json({ message: "Wrong Password", result: null, success: false })
            }
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }

    @Validate(UserReqValidator.register)
    async register(req: Request, res: Response) {
        try {
            const { email, password, type,name } = req.body
            const HashedPassword =   utils.HashPassword(password)
            const user = await InjectRepository(TenantUsersEntity).save({ email, password:HashedPassword,name })
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
import type { Request, Response } from "express";
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse
} from '@simplewebauthn/server'

class UserController {
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
export default new UserController()
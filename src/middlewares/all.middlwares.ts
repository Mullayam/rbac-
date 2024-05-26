import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from "jsonwebtoken";
import { IUser } from "@/utils/types";
import { CONFIG } from "@/app/config";
import session from 'express-session'

class AllMiddlewares {
    /**
    * Validates if the user is an admin by checking the session ID.
    *
    * @param {Request} req - The request object.
    * @param {Response} res - The response object.
    * @param {NextFunction} next - The next middleware function.
    */
    public async validateAdminSession(req: Request, res: Response, next: NextFunction) {
        try {
            const sessionId = String(req.headers["sessionid"]) || null
            if (!sessionId || sessionId === "null" || sessionId === "undefined") {
                return res.json({ message: "Session Id is missing", result: null, success: false })
            }

            const session: Partial<session.SessionData> | undefined = await new Promise((resolve, reject) => {
                req.sessionStore.get(sessionId, (err, session) => {

                    if (err) reject(err)
                    if (session) resolve(session)
                    if (typeof session === "undefined") resolve(session)
                })
            })

            if (typeof session === "undefined") {
                return res.json({ message: "Invalid Session", result: null, success: false })
            }
            if (!session.hasOwnProperty(sessionId)) {
                return res.json({ message: "Invalid Session", result: null, success: false })
            }
            next()
        } catch (error: any) {
            return res.json({ message: error.message, result: null, success: false })
        }
    }

    public customMiddlewareFunction(req: Request, res: Response, next: NextFunction) {
        // Your custom middleware logic goes here
        console.log('Custom Middleware executed');
        next();
    }
    /**
    * Validates the user's authorization token.
    *
    * @param {Request} req - The request object.
    * @param {Response} res - The response object.
    * @param {NextFunction} next - The next function in the middleware chain.
    * @return {void} This function does not return a value.
    */
    public validateUserAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers["authorization"] as String || null

            if (!authHeader) {
                return res.status(400).json({ message: "Authorization header is missing", result: null, success: false })
            }
            const token = authHeader?.replace("JWT ", "")
            if (!token) {
                return res.status(401).json({ message: "Authorization Token is missing", result: null, success: false })
            }
            const decodedToken = jwt.verify(token, CONFIG.SECRETS.JWT_SECRET_KEY) as IUser
            if (!decodedToken) {
                return res.status(401).json({ message: "Invalid Token", result: null, success: false })
            }
            if (decodedToken.role !== "User") {
                return res.status(401).json({ message: "Access Denied", result: null, success: false })
            }
            // req.session["user"] = decodedToken
            req.user = decodedToken
            next()
        } catch (error: any) {
            return res.status(401).json({ message: "Invalid Token", result: error.message, success: false })
        }

    }
    /**
     * Validates if the user making the request is an admin.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function.
     */


    public me(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers["authorization"] as String || null

            if (!authHeader) {
                return res.json({ message: "Authorization header is missing", result: null, success: false })
            }
            const token = authHeader?.replace("JWT ", "")
            if (!token) {
                return res.json({ message: "Authorization Token is missing", result: null, success: false })
            }
            const decodedToken = jwt.verify(token, CONFIG.SECRETS.JWT_SECRET_KEY)
            if (!decodedToken) {
                return res.json({ message: "Invalid Token", result: null, success: false })
            }
            return res.json({ message: "Validated Token", result: decodedToken, success: true })
        } catch (error: any) {
            return res.json({ message: "Invalid Token", result: error.message, success: false })
        }
    }
}


export function ApplyMiddleware(middlewareFunction: keyof AllMiddlewares): RequestHandler {
    const instance = new AllMiddlewares()
    return function (req: Request, res: Response, next: NextFunction) {
       return instance[middlewareFunction](req, res, next);
    };
}

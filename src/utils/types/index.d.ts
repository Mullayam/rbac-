import { CONFIG } from "@/app/config";
import { Request, Response, NextFunction, Send } from "express";
import { JwtPayload } from "jsonwebtoken";
import { TemplateOptions } from "nodemailer-express-handlebars";
import { Ability } from '@casl/ability';
export type Type<C extends object = object> = new (...args: any) => C;
export type AppConfig = typeof CONFIG;
export interface ExpressMiddleware {
    activate(req: Request, res: Response, next: NextFunction): void;
}
declare global {
    namespace Express {
        export interface Request {
            session: {
                user?: UserInfoJwtPayload;
                [key: string]: any;
            };
            files?: fileUpload.FileArray | null | undefined;
            ability: Ability<[string, any]>;
            user?: UserInfoJwtPayload;
            tenantId: string;
            dbConfig: null;
        }
    }
}
interface UserInfoJwtPayload {
    uid?: string;
    email?: string;
    role?: string;
    status?: string;
}

export interface ResponseHandler extends Response {
    json: CustomResponse;
}
interface CustomResponse {
    success: boolean;
    message: string;
    result: null | Record<string, any>;
    [key: string]: any;
}
export interface IUser {
    firstName: string;
    lastName: string;
    avatar: string;
    email: string;
    role: IRole;
    isEmailVerified: boolean;
}

export interface InterceptorsSettings {
    response: Record<string, any>;
    isEnable?: boolean;
}

export interface AuthProviders {
    [key: AuthProvidersList]: AuthProvidersKeys;
}
export interface AuthProvidersScopes {
    [key: AuthProvidersList]: string[];
}
export interface AuthProvidersKeys {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}
export type AuthProvidersList = "google" | "facebook" | "github";

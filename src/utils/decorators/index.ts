import jwt from "jsonwebtoken";
import { CONFIG } from "@/app/config";
import { interval, timer } from "rxjs";
import { AppDataSource } from "@/app/config/Datasource";
import { ObjectType, Repository, Entity, ObjectLiteral } from "typeorm";
import type { Request, Response, NextFunction } from "express";
import { IUser } from "@/utils/types";
import { AllowedRoles } from "@/utils/helpers/constants";

export function Accessible(allowedRoles: AllowedRoles[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            try {
                const user = (req as any).user;
                if (!user) {
                    return res.status(401).json({ message: 'User not authenticated', result: null, success: false });
                }
                const userRoles = (user.role).toUpperCase() || [];
                
                const hasRole = Array.isArray(allowedRoles)
                    ? allowedRoles.some(role => userRoles.includes(role.toUpperCase()))
                    : userRoles.includes(allowedRoles);

                if (!hasRole) {
                    return res.status(401).json({ message: "Access Denied", result: null, success: false })
                }

                return originalMethod.apply(this, [req, res, next]);
            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error", result: "Something went wrong", success: false })
            }
        };

        return descriptor;
    };
}
export function isAuthorized(opts: { isPublic: boolean } = { isPublic: false }) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            try {
                if (opts.isPublic) return next();
                const authHeader = req.headers["authorization"] as String || null

                if (!authHeader) {
                    return res.status(400).json({ message: "Authorization header is missing", result: null, success: false })
                }
                if (authHeader.trim() === "" || authHeader.includes("JWT ")) {
                    return res.status(400).json({ message: "Token is missing", result: null, success: false })
                }
                const token = authHeader?.replace("JWT ", "")
                if (!token) {
                    return res.status(401).json({ message: "Authorization Token is missing", result: null, success: false })
                }
                const decodedToken = jwt.verify(token, CONFIG.SECRETS.JWT_SECRET_KEY) as IUser
                if (!decodedToken) {
                    return res.status(401).json({ message: "Invalid Token", result: null, success: false })
                }
                // req.session["user"] = decodedToken 
                (req as any).user = decodedToken;

                return originalMethod.apply(this, [req, res, next]);
            } catch (error) {
                return res.status(401).json({ message: "Token is invalid", result: null, success: false })
            }
        };

        return descriptor;
    }
}
export function XInjectRepository<Entity>(entity: ObjectType<Entity>) {
    return function (target: any, propertyName: string): void {

        Object.defineProperty(target, propertyName, {
            // Getter function to retrieve the repository
            get() {
                // Return the repository for the specified entity
                return AppDataSource.getRepository(entity);
            },
            // Make the property read-only
            configurable: false,
            enumerable: true,
        });
    };
}
/**
 * Creates a property decorator that injects a repository instance for the specified entity into a target object property.
 *
 * @template Entity - The type of the entity.
 * @param {ObjectType<Entity>} entity - The entity type for which to inject the repository.
 * @return {PropertyDecorator} A property decorator that injects the repository instance.
 */
export function XInjectRepository2<Entity extends ObjectLiteral>(entity: ObjectType<Entity>): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {

        const repository: Repository<Entity> = AppDataSource.getRepository(entity);

        Object.defineProperty(target, propertyKey, {
            value: repository,
            writable: false,
        });
    };
}
/**
 * Decorator to handle setInterval.
 *
 * @param {number} intervalTime - The time in milliseconds to wait before executing the original method.
 * @return {Function} - A decorator function that wraps the original method with a setInterval.
 */
export function HandleInterval(intervalTime: number) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const originalFunction = originalMethod.apply(this, args);
            const intervalObservable = interval(intervalTime);

            const subscription = intervalObservable.subscribe(() => {
                originalFunction.apply(this, args);
            });

            return subscription;
        };

        return descriptor;
    };
}

/**
 * Decorator function to handle setTimeout.
 *
 * @param {number} timeout - The time in milliseconds to wait before executing the original method.
 * @return {Function} - A decorator function that wraps the original method with a setTimeout.
 */
export function HandleTimeout(timeout: number) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const originalFunction = originalMethod.apply(this, args);
            const timeoutObservable = timer(timeout);

            const subscription = timeoutObservable.subscribe(() => {
                originalFunction.apply(this, args);
            });

            return subscription;
        };

        return descriptor;
    };
}

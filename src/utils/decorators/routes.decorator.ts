import { Request, Response, NextFunction, Router } from 'express';

// Define a decorator factory function that takes a base path as input
export function Controller(basePath: string = '', middleware?: any[]) {
    return function (constructor: Function) {
        const router: any = Router();
        const methods = Object.getOwnPropertyNames(constructor.prototype);

        // Register routes for each method of the class
        methods.forEach(methodName => {
            const method = constructor.prototype[methodName];
            const routePath = Reflect.getMetadata('path', constructor.prototype, methodName) || '/';
            const httpMethod: string = Reflect.getMetadata('method', constructor.prototype, methodName) || 'get';
            const fullPath = `${basePath}${routePath}`;

            if (httpMethod && fullPath && typeof method === 'function') {
                router[httpMethod](fullPath, middleware, async (req: Request, res: Response, next: NextFunction) => {
                    try {
                        await method.call(constructor.prototype, req, res, next);
                    } catch (error) {
                        next(error);
                    }
                });
            }
        });

        // Register the router as middleware
        Reflect.defineMetadata('router', router, constructor);
    };
}
/**
 * Route decorator factory, creates decorator
 */
function decoratorFactory(method: string, url: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('method', 'get', target, propertyKey);
        Reflect.defineMetadata('path', url, target, propertyKey);
    };
}

// Define decorators for HTTP methods
export function Get(path: string = '/') {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('method', 'get', target, propertyKey);
        Reflect.defineMetadata('path', path, target, propertyKey);
    };
}

export function Post(path: string = '/') {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('method', 'post', target, propertyKey);
        Reflect.defineMetadata('path', path, target, propertyKey);
    };
}
export function Put(path: string = '/') {
    return decoratorFactory('put', path);
}

// Decorator for extracting and validating route parameters
export function Param(paramName: string) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        Reflect.defineMetadata('param', paramName, target, propertyKey);
    };
}

// Decorator for extracting and validating query parameters
export function Query(queryName: string) {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        Reflect.defineMetadata('query', queryName, target, propertyKey);
    };
}

// Decorator for extracting and validating request body
export function Body() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        Reflect.defineMetadata('body', parameterIndex, target, propertyKey);
    };
}

// Decorator for accessing the Express Request object
export function Request() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        Reflect.defineMetadata('request', parameterIndex, target, propertyKey);
    };
}

// Decorator for accessing the Express Response object
export function Response() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        Reflect.defineMetadata('response', parameterIndex, target, propertyKey);
    };
}

// Decorator for applying middleware to a route handler
export function Middleware(middleware: (req: Request, res: Response, next: NextFunction) => void) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            middleware(req, res, next);
            return originalMethod.apply(this, arguments);
        };

        return descriptor;
    };
}
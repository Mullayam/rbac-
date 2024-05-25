import { Request, Response, NextFunction, RequestHandler } from 'express';

class AllMiddlewares {
    public customMiddlewareFunction(req: Request, res: Response, next: NextFunction) {
        // Your custom middleware logic goes here
        console.log('Custom Middleware executed');
        next();
    }
}


export function ApplyMiddleware(middlewareFunction: keyof AllMiddlewares): RequestHandler {
    const instance = new AllMiddlewares()
    return function (req: Request, res: Response, next: NextFunction) {
       
        instance[middlewareFunction](req, res, next);
    };
}

//  Write Your All API Routes Here
import { Exception } from '@enjoys/exception';
import { Router } from 'express'
import { MainRoutes } from './main.routes';
import { ApplyMiddleware } from '@/middlewares/all.middlwares';
import { Validator } from '@/middlewares/validator.middleware';
import { UserReqValidator } from '@/factory/validators/User.request.validator';
import { UserController, AuthController } from '@/controllers/user';

export class ApiRoutes {
    constructor(public apiRoutes: Router = Router()) {
        this.PublicRoutes();
        this.ProtectedRoutes();
        this.UnhandledRoutes();
    }

    /**
     Creates the Public Routes 
     */
    private PublicRoutes(): void {
        this.apiRoutes.post("/auth/login", AuthController.default.login)
        this.apiRoutes.post("/auth/register", AuthController.default.register)
        this.apiRoutes.post("/auth/web/register-challenge", UserController.default.registerForChallenge)
        this.apiRoutes.post("/auth/web/verify-challenge", UserController.default.verifyChallenge)
        this.apiRoutes.post("/auth/web/login-challenge", UserController.default.loginForChallenge)
        this.apiRoutes.post("/auth/web/login-verify-challenge", UserController.default.loginVerifyChallenge)

    }
    /**
     * Creates the protected routes.
     *
     * @protected
     * @return {void}
     */
    protected ProtectedRoutes(): void {        

        this.apiRoutes.get("/me", AuthController.default.hello)
        this.apiRoutes.get("/protected", AuthController.default.hello)
        this.apiRoutes.get("/public", AuthController.default.hello)

        this.apiRoutes.use(ApplyMiddleware("customMiddlewareFunction"), Validator.forFeature(UserReqValidator.login), new MainRoutes().routes)
    }
    /**
     * A function to handle unhandled routes.
     *
     * @returns {void} This function does not return anything.
     */
    private UnhandledRoutes(): void {
        this.apiRoutes.use("/*", (req, res) => {
            throw new Exception.HttpException({ name: "FORBIDDEN", message: "Access Denied", stack: { info: "Forbidden Resource", path: req.baseUrl } })
        }
        )
    }

}
//  Write Your All API Routes Here
import AuthController from '@/controllers/user/AuthController';
import RolesController from '@/controllers/user/RolesController';
import { Exception } from '@enjoys/exception';
import { Router } from 'express'

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
        this.apiRoutes.post("/auth/login", AuthController.login)
        this.apiRoutes.post("/auth/register", AuthController.register)

    }
    /**
     * Creates the protected routes.
     *
     * @protected
     * @return {void}
     */
    protected ProtectedRoutes(): void {
        this.apiRoutes.route("/role")
            .get(RolesController.findAll)
            .put(RolesController.updateRole)
            .post(RolesController.create)
            .delete(RolesController.findAll)

        this.apiRoutes.get("/me", AuthController.hello)
        this.apiRoutes.get("/protected", AuthController.hello)
        this.apiRoutes.get("/public", AuthController.hello)
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
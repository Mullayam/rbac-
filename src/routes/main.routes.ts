//  Write Your All API Routes Here 
import { Router } from 'express'
import { Exception } from '@enjoys/exception';
import { UserController, ModulesController, RacmapController, RolesController, SubModulesController, ManageRolesController } from '@/controllers/user';

export class MainRoutes {
    constructor(public routes: Router = Router()) {
        this.PublicRoutes();
        this.ProtectedRoutes();
        this.UnhandledRoutes();
    }

    /**
     Creates the Public Routes 
     */
    private PublicRoutes(): void {

    }
    /**
     * Creates the protected routes.
     *
     * @protected
     * @return {void}
     */
    protected ProtectedRoutes(): void {
        // Privilleges Routes
        this.routes.get("/privilleges", RolesController.default.getPrivilleges)
        // Modules Routes
       this.routes.route("/module")
       .get(ModulesController.default.find)
       .post(ModulesController.default.create)
       .put(ModulesController.default.update)
       .delete(ModulesController.default.delete)
       // SubModules Routes
       this.routes.route("/submodule")
       .get(SubModulesController.default.find)
       .post(SubModulesController.default.create)
       .put(SubModulesController.default.update)
       .delete(SubModulesController.default.delete)
       // Roles Routes
       this.routes.route("/role")
       .get(RolesController.default.find)
       .post(RolesController.default.create)
       .put(RolesController.default.update)
       .delete(RolesController.default.delete)
       // Racmap Routes
       this.routes.route("/manage-racmap")
       .get(RacmapController.default.find)
       .post(RacmapController.default.create)
       .put(RacmapController.default.update)
       .delete(RacmapController.default.delete)

       // Manage User Roles
       this.routes.patch("/assign-role", ManageRolesController.default.assignRole)
       this.routes.patch("/unassign-role", ManageRolesController.default.unAssignRole)
       this.routes.put("/edit-privillege-of-module", ManageRolesController.default.editPrivillegeOfModule)
    }
    /**
     * A function to handle unhandled routes.
     *
     * @returns {void} This function does not return anything.
     */
    private UnhandledRoutes(): void {
        this.routes.use("/*", (req, res) => {
            throw new Exception.HttpException({ name: "FORBIDDEN", message: "Access Denied", stack: { info: "Forbidden Resource", path: req.baseUrl } })
        }
        )
    }

}
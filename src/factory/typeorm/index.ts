import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm'
import { AppDataSource } from "@/app/config/Datasource"
import { Logging } from "@/logs"

export const InjectRepository = <T>(repo: EntityTarget<T extends ObjectLiteral ? T : ObjectLiteral>) => AppDataSource.getRepository(repo)
export const DBManager: EntityManager = AppDataSource.manager
export const createConnection = () => AppDataSource.initialize().then(async () => Logging.dev("Database Connected")).catch(error => {
    Logging.dev(error, "error")
    process.exit(1)
})
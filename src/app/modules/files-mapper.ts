import * as fs from 'fs'
import path from "path"
import { Type } from '@/utils/types'
import { createRequire, register } from 'module'

type T = "controller" | "entity" | "service" | "middleware" | "migrations"
export class FilesMapper {
    /**
     * A funtion to import modules only from directories
     *
     * @param {string} pathName - path to the file
     * @param {"default" | "special"} [type="default"] - description of parameter
     * @return {Type[] | any} description of return value
     */
    static forRoot<K>(pathName: string, type: "default" | "special" = "default"): Type[] | any {
        const __workingDir = path.join(process.cwd(), pathName)
        let modules: any = [];
    
        const result = fs.readdirSync(__workingDir)
            .filter((file) => file.startsWith('index') === false)
            .filter((file) => (path.extname(file) === '.js') || (file !== '.ts') && !file.endsWith('.d.ts'))
            .filter((file) => file.indexOf(".spec") === -1 && file.indexOf(".test") === -1)
           
        if (type === "default") {
            modules = result.map((file) => require(`${__workingDir}/${file}`).default as any)
            return modules
        }

        if (type === "special") {
            result.forEach((file) => {
                const module = require(`${__workingDir}/${file}`) as any
                 
              
                for (const key in module) {
                    // Check if the key is a function
                    if (typeof module[key] === 'function') {
                        
                        modules.push(module[key])
                    }
                }
            })
            return modules
        }


    }
    /**
     * A funtion to import modules like "controller" | "entity" | "service" | "middleware" | "migrations"
     *
     * @param {string} pathName - path to modules    
     * @return {Type[] | any} description of return value
     */
    static forFeature<K>(pathName: string): Type[] | any {
        const __workingDir = path.join(process.cwd(), pathName)
        return fs.readdirSync(__workingDir)
            .filter((file) => file.startsWith('index') === false)
            .filter((file) => (path.extname(file) === '.js') || (file !== '.ts') && !file.endsWith('.d.ts'))
            .filter((file) => file.indexOf(".spec") === -1 && file.indexOf(".test") === -1)
            .map((file) => require(`${__workingDir}/${file}`).default as any)
    }
    static _importModules(directoryPath: string): void {
        const files = fs.readdirSync(path.join(process.cwd(), directoryPath));
    
        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
            console.log(filePath)
            const stats = fs.statSync(filePath);
    
            if (stats.isDirectory()) {
                // Recursively import files from subdirectories
                this._importModules(filePath);
            } else if (stats.isFile()) {
                // Import files
                if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
                    import(filePath).then(module => {
                        console.log(`Imported module from: ${filePath}`);
                        // Do something with the imported module if needed
                    }).catch(error => {
                        console.error(`Error importing module from ${filePath}: ${error}`);
                    });
                }
            }
        });
    }
}
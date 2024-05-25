import { interval, timer } from "rxjs";
import { AppDataSource } from "@/app/config/Datasource";
import { ObjectType, Repository, Entity, ObjectLiteral } from "typeorm";


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
export function InjectRepository<Entity extends ObjectLiteral>(entity: ObjectType<Entity>): PropertyDecorator {
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

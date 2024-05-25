import { Observable } from 'rxjs';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { Storage } from '@utils/storage';
import { FileUploadOptions } from '../types/fileupload.interface';
import { METADATA_KEYS } from '../helpers/constants';
import { validationResult } from 'express-validator';
import { Logging } from '@/logs';
// HttpStatus decorator
export function HttpStatus(code: number): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            const result = originalMethod.apply(this, arguments);
            // this.res.status(code);
            return result;
        };
        return descriptor;
    };
}

// Delay decorator
// @UseDelay((req, res, next) => {
//     console.log('Interceptor called');
//     return new Observable(observer => {
//       // Perform some asynchronous operation
//       setTimeout(() => {
//         console.log('Interceptor completed');
//         observer.next();
//         observer.complete();
//       }, 3000);
//     });
//   })

/**
 * Returns a decorator function that delays the response using the provided delay function.
 *
 * @param {Function} delayFunc - The function that introduces the delay.
 * @return {Function} The decorator function for delaying the response.
 */
export function UseDelayResponse(delayFunc: (req: Request, res: Response, next: () => void) => Observable<any>) {
   Logging.dev("Delay in Response is Initiated")
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (req: any, res: any, next: () => void) {
            delayFunc(req, res, next).subscribe(() => {
                originalMethod.apply(this, [req, res, next]);
            });
        };
        return descriptor;
    };
}
/**
 * Returns a function decorator that handles file upload operations.
 *
 * @param {FileUploadOptions} data - Optional data for file uploads.
 * @return {Function} The decorated function for file upload handling.
 */
export function UploadFile(data?: FileUploadOptions) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        Reflect.defineMetadata(METADATA_KEYS.FILE_UPLOAD_OPTIONS, JSON.stringify(data), target, key);
        descriptor.value = function (req: any, res: any, next: () => void) {
            new Storage().UploadFiles(req, res, () => {
                originalMethod.call(this, req, res, next);
            });
        };
        return descriptor;
    };
}
/**
 * Throttles the API calls based on the specified delay.
 *
 * @param {number} delay - The delay in milliseconds for throttling.
 * @return {Function} The throttled function for API calls.
 */
export function ThrottleApi(delay: number) {
   Logging.dev("Response Throttling in API is Enabled")
    let lastExecution = 0;
    return function (target: any, key: any, descriptor: { value: (...args: any[]) => Promise<any>; }) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any) {
            const now = Date.now();
            if (now - lastExecution >= delay) {
                lastExecution = now;
                return originalMethod.apply(this, args);
            } else {
                console.log(`Method ${key} throttled.`);
            }
        };
    };
}
/**
 * A decorator function that adds validation logic to the target method.
 *
 * @param {any[]} validations - Array of validation rules to apply.
 * @returns {PropertyDescriptor} The updated property descriptor with validation logic.
 */
export function Validate(validations: any[]) {   
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req: any, res: any, next: () => void) {
            // Validator.forFeature(validations)(req, res, next);
            await Promise.all(validations.map((rule: any) => rule.run(req)));
            const errors = validationResult(req);
            const err = errors.formatWith(x => x.msg).array().filter(x => x !=="Invalid value")          

            if (!errors.isEmpty()) {
                return res.status(422).json({ message: "Validation Error", result: err, success: false })
            }
            return originalMethod.apply(this, arguments);
        };
        return descriptor;
    };
}
import { ExpressValidator } from 'express-validator';
const myExpressValidator = new ExpressValidator();
const { query, body } = myExpressValidator;

export const UserRefreshTokenValidator = () => query('token').isString().notEmpty().withMessage('Please Provide Token query string');

export const UserReqValidator = {
    register: [
        body('email').isString().isEmail().withMessage('Enter valid a email').notEmpty().withMessage('Please Provide Email'),
        body('type').isString().notEmpty().isIn(['USER', 'ADMIN']).withMessage('Please Provide Type USER,ADMIN,SUPERADMIM'),
        body('password').isString().isLength({ min: 6, max: 16 }).withMessage('Password should be min 6 and max 16').notEmpty().withMessage('Please Provide Password'),
    ],
    login: [
        body('email').isString().isEmail().withMessage('Enter valid a email').notEmpty().withMessage('Please Provide Email'),
        body('password').isString().isLength({ min: 6, max: 16 }).withMessage('Password should be min 6 and max 16').notEmpty().withMessage('Please Provide Password'),
    ],
}
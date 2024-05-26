import bcrypt from "bcryptjs";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
import jwt from 'jsonwebtoken' 
import { CONFIG } from "@/app/config";

class Utils {
     HashPassword(PasswordStr: string): string {
        return bcrypt.hashSync(PasswordStr, salt);
    }
      ComparePassword(HashedPassword: string, Password: string): boolean {
        return bcrypt.compareSync(Password, HashedPassword);
    }
    signJWT(payload: any, kid: string): string {
        return jwt.sign(payload, CONFIG.SECRETS.JWT_SECRET_KEY, {
            expiresIn: '7d',
            issuer: "ENJOYS",
            header: {
                alg: "HS256",
                typ: "JWT",
                kid,
            }
        });
    }
    verifyJWT(token: string, options?: jwt.VerifyOptions): any {
        return jwt.verify(token, CONFIG.SECRETS.JWT_SECRET_KEY, options);
    }   
    decodeToken(token: string): any {
        return jwt.decode(token);
    }
    

}
export default new Utils()
import type { Request, Response } from "express";
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
    VerifiedRegistrationResponse
} from '@simplewebauthn/server'
import { TenantUsersEntity } from "@/factory/entities/tenant_users.entity";
import { SessionsEntity } from "@/factory/entities/session.entity";
import { InjectRepository } from "@/factory/typeorm";
import { CacheService } from "@/utils/services/CacheService";
import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from "node_modules/@simplewebauthn/server/script/deps";

// I'm using cache here u can use locall variable to store the data like userStore/Challenge Store = {}
const { cache } = CacheService.createInstance()
type CredentialCreationOptions = {
    uid: number,
    challengePayload: PublicKeyCredentialCreationOptionsJSON,
    opt?: PublicKeyCredentialRequestOptionsJSON,
    verificationResult: VerifiedRegistrationResponse
}
class UserController {
    async registerForChallenge(req: Request, res: Response) {
        try {
            const { machinName, email } = req.body
            const expected_origin = req.get('origin') || req.hostname
            const rpID = String(req.ip)
            const isUserExist = await InjectRepository(TenantUsersEntity).findOneBy({ email })
            if (!isUserExist) {
                return res.json({ message: "This email is not registered", result: null, success: false })
            }
            const challengePayload = await generateRegistrationOptions({
                rpID,
                rpName: machinName,
                attestationType: 'none',
                userName: email.split("@")[0],
                timeout: 30_000,
                userDisplayName: isUserExist.name,
            })
            await cache.set(email, JSON.stringify({ uid: isUserExist.id, challengePayload }))

            await InjectRepository(SessionsEntity).save({
                expected_origin,
                rpid: rpID, session_name: 'test',
                challenge: challengePayload.challenge, user: isUserExist
            })

            return res.json({ message: "OK", result: null, success: true })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async verifyChallenge(req: Request, res: Response) {
        try {
            const { email } = req.user
            const { challengePayload } = req.body

            const cachePayload = await cache.get(email) as unknown as CredentialCreationOptions

            const tUserInstance = new TenantUsersEntity()
            tUserInstance.id = +cachePayload.uid

            const expected_origin = req.get('origin') || req.hostname
            const rpID = String(req.ip)


            const verificationResult = await verifyRegistrationResponse({
                expectedChallenge: cachePayload.challengePayload.challenge,
                expectedOrigin: expected_origin,
                expectedRPID: rpID,
                response: challengePayload,
            })

            if (!verificationResult.verified) return res.json({ message: "Could not verify the PassKey", result: null, success: false });
            await cache.set(email, JSON.stringify({ ...cachePayload, verificationResult: verificationResult.registrationInfo }))

            return res.json({
                message: "OK", result: {
                    verified: verificationResult.verified
                }, success: true
            })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async loginForChallenge(req: Request, res: Response) {
        try {
            const { email } = req.body
            const expected_origin = req.get('origin') || req.hostname
            const rpID = String(req.ip)
            const opts = await generateAuthenticationOptions({
                rpID,
            })
            const isUserExist = await InjectRepository(TenantUsersEntity).findOneBy({ email })
            if (!isUserExist) {
                return res.json({ message: "This email is not registered", result: null, success: false })
            }
            const cachePayload = await cache.get(email) as unknown as CredentialCreationOptions | null
            if (cachePayload === null || !cachePayload || cachePayload === undefined) {
                await cache.set(email, JSON.stringify({ uid: isUserExist.id, opt: opts.challenge }))
            }
            await cache.set(email, JSON.stringify({ uid: isUserExist.id, opt: opts.challenge }))


            return res.json({ message: "OK", result: opts, success: true })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async loginVerifyChallenge(req: Request, res: Response) {
        try {
            const { challengeCredential, email } = req.body
            const cachePayload = await cache.get(email) as unknown as CredentialCreationOptions
            const result = await verifyAuthenticationResponse({
                expectedChallenge: cachePayload.challengePayload.challenge,
                expectedOrigin: 'http://localhost:3000',
                expectedRPID: 'rpID',
                response: challengeCredential,
                authenticator: cachePayload.verificationResult.registrationInfo!
            })

            if (!result.verified) return res.json({ error: 'something went wrong' })
            // Login the user: Session, Cookies, JWT         

            return res.json({
                message: "OK", result: {
                    
                }, success: true
            })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
}
export default new UserController()
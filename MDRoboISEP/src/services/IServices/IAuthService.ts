import { Request, Response } from "express";
import { Result } from "../../core/logic/Result";

export default interface IAuthService {
    isAuthenticaded(req: Request): Result<boolean>;
    isAuthorized(req: Request, authorizedRoles: string[]): Result<boolean>;
    checkAuth(req: Request, res:Response, authorizedRoles: string[]): Result<void>;
}
import IAuthService from "../IServices/IAuthService"
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import config from "../../../config";
import { Service } from "typedi";
import { Result } from "../../core/logic/Result";

@Service()
export default class AuthService implements IAuthService {
    public checkAuth(req:Request, res:Response, authorizedRoles: string[]) : Result<void>{
        const authnOrError = this.isAuthenticaded(req);
        const authzOrError = this.isAuthorized(req, authorizedRoles);
        if(authnOrError.isFailure){
          if(String(authnOrError.errorValue()) === "Sessão expirada"){
            res.status(440);
            return Result.fail<void>("Sessão expirada");
          }else{
            res.status(401);
            return Result.fail<void>(authnOrError.errorValue());
          }
        }else if(authzOrError.isFailure){
          if(String(authzOrError.errorValue()) === "Sessão expirada"){
            res.status(440);
            return Result.fail<void>(authzOrError.errorValue());
          }else{
            res.status(403);
            return Result.fail<void>(authzOrError.errorValue());
          }
        }else{
          return Result.ok<void>();
        }
    }
    public isAuthenticaded(req: Request): Result<boolean> {
        try{
            const authenticationHeader = req.headers["authorization"] as string;
            if(authenticationHeader === undefined){
                return Result.fail<boolean>("Não está autenticado");
            }
            const token = authenticationHeader.split(" ")[1];
            const decoded = jwt.verify(token, config.jwtSecret);

            const email = (decoded as any).email;
            if (email) {
            return Result.ok<boolean>(true);
            }
            return Result.fail<boolean>("Não está autenticado");
        }catch(e){
            if(e.name === "TokenExpiredError"){
                return Result.fail<boolean>("Sessão expirada");
            }
            return Result.fail<boolean>("Erro na autenticação");
        }
    }

    public isAuthorized(req: Request, authorizedRoles: string[]): Result<boolean> {
        try{
            const authenticationHeader = req.headers["authorization"] as string;
            if(authenticationHeader === undefined){
                return Result.fail<boolean>("Não está autorizado a aceder a este recurso");
            }
            const token = authenticationHeader.split(" ")[1];
            const decoded = jwt.verify(token, config.jwtSecret);
            const role = (decoded as any).role;

            if (authorizedRoles.includes(role)) {
            return Result.ok<boolean>(true);
            }
            return Result.fail<boolean>("Não está autoizado a aceder a este recurso");
        }catch(e){
            if(e.name === "TokenExpiredError"){
                return Result.fail<boolean>("Sessão expirada");
            }
            return Result.fail<boolean>("Erro na autenticação");
        }
    }
}
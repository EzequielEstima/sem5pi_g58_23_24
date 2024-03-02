import { Request, Response, NextFunction } from 'express';

export default interface IUserController  {
    login(req: Request, res: Response, next: NextFunction);
    signup(req: Request, res: Response, next: NextFunction);
    approveOrRejectSignUp(req: Request, res: Response, next: NextFunction);
    listarUtilizadoresPendentes(req: Request, res: Response, next: NextFunction);
    signupUtente(req: Request, res: Response, next: NextFunction);
    delete(req: Request, res: Response, next: NextFunction);
    alterarDadosUser(req: Request, res: Response, next: NextFunction);
    deleteUtente(req: Request, res: Response, next: NextFunction);
    copiaDadosPessoais(req: Request, res: Response, next: NextFunction);
}
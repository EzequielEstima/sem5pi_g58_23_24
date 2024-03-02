import { Request, Response, NextFunction } from 'express';

export default interface IEdificioController  {
    getInformacaoPlaneamento(req: Request, res: Response, next: NextFunction);
    criarEdificio(req: Request, res: Response, next: NextFunction);
    listarEdificioMinEMaxPisos(req: Request, res: Response, next: NextFunction)
    listarEdificios(req: Request, res: Response, next: NextFunction);
    editarEdificio(req: Request, res: Response, next: NextFunction);
    deleteEdificio(req: Request, res: Response, next: NextFunction);
}
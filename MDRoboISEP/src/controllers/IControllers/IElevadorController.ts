import { NextFunction, Request, Response } from "express";

export default interface IElevadorController{
    criarElevador(req: Request, res: Response, next:NextFunction)
    editarElevador(req: Request, res: Response, next: NextFunction)
    listarElevadoresDoEdificio(req: Request, res: Response, next: NextFunction)
}
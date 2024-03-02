import { NextFunction, Request, Response } from "express";

export default interface IPassagemController{
    editarPassagens(req: Request, res: Response, next:NextFunction)
    listarPisosComPassagens(req: Request, res: Response, next:NextFunction)
    criarPassagem(req: Request, res: Response, next:NextFunction)
    listarPassagensPorParDeEdificios(req: Request, res: Response, next:NextFunction)
}
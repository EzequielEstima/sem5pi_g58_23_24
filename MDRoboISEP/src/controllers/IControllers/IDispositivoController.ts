import { Request, Response, NextFunction } from 'express';

export default interface IDispositivoController  {
    inibirDispositivo(req: Request, res: Response, next: NextFunction): void;
    adicionarDispositivoAFrota(req: Request, res: Response, next: NextFunction);
    listarDispositivosDaFrota(req: Request, res: Response, next: NextFunction);
    listarCodigoDosDispositivosDaFrotaPorTarefa(req: Request, res: Response, next: NextFunction);
}
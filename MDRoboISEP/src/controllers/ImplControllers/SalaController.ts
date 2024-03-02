import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import ISalaController from '../IControllers/ISalaController';
import ISalaService from '../../services/IServices/ISalaService';
import ISalaDTO from '../../dto/ISalaDTO';
import IAuthService from '../../services/IServices/IAuthService';
@Service()
export default class SalaController implements ISalaController {
  constructor(
      @Inject(config.services.sala.name) private salaServiceInstance : ISalaService,
      @Inject(config.services.auth.name) private authServiceInstance : IAuthService
  ) {}

  public async criarSala(req: Request, res: Response, next: NextFunction) {
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus']);
      if(authOrError.isFailure){
        return res.send();
      }
      const salaOrError = await this.salaServiceInstance.criarSala(req.body as ISalaDTO) as Result<ISalaDTO>;
      if (salaOrError.isFailure) {
        let message = String(salaOrError.errorValue());
        if (message === "Edificio não existe" || message === "Piso não existe") {
          res.status(404);
          return res.json(salaOrError.errorValue());
        }
        return res.status(400).json(salaOrError.errorValue());
      }
      const salaDTO = salaOrError.getValue();
      res.status(201);
      return res.json( salaDTO );
    }catch(e){
      return next(e);
    }
  }
}
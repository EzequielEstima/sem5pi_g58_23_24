import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";

import IPlaneamentoController from '../IControllers/IPlaneamentoController';
import IPlaneamentoService from '../../services/IServices/IPlaneamentoService';
import IAuthService from '../../services/IServices/IAuthService';
@Service()
export default class PlaneamentoController implements IPlaneamentoController{
  constructor(
      @Inject(config.services.planeamento.name) private planeamentoServiceInstance : IPlaneamentoService,
      @Inject(config.services.auth.name) private authServiceInstance : IAuthService
  ) {}
  
  async encontrarCaminhosEntreEdificios(req: Request, res: Response, next: NextFunction) {
    try {
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de tarefas', 'utente']);
      if(authOrError.isFailure){
        return res.send();
      }
      const salaInicial = req.query.salaInicial as string;
      const salaFinal = req.query.salaFinal as string;
      const planeamentoOrError = await this.planeamentoServiceInstance.encontrarCaminhosEntreEdificios(salaInicial, salaFinal);
        
      if (planeamentoOrError.isFailure) {
        let message = String(planeamentoOrError.errorValue());
        if(message === "A sala com o nome" + salaInicial + " não existe" || message === "A sala com o nome" + salaFinal + " não existe"){
          return res.status(404).json( planeamentoOrError.errorValue());
        }
        return res.json( planeamentoOrError.errorValue()).status(400).send();
      }

      const planeamento = planeamentoOrError.getValue();
      res.status(200);
      return res.json( planeamento );
    }
    catch (e) {
      return next(e);
    }
  };

  public async encontrarCaminhoVigilancia(req: Request, res: Response, next: NextFunction) {
    try {
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de tarefas', 'utente']);
      if(authOrError.isFailure){
        return res.send();
      }
      const codEdificio = req.query.codigoEd as string;
      const numeroPiso = req.query.numeroPiso as string;

      const planeamentoOrError = await this.planeamentoServiceInstance.encontrarCaminhoVigilancia(codEdificio, numeroPiso);
        
      if (planeamentoOrError.isFailure) {
        let message = String(planeamentoOrError.errorValue());
        if(message == "O edificio com o código " + codEdificio + " não existe" || message == "O piso " + numeroPiso + " não existe" ){
          return res.status(404).json( planeamentoOrError.errorValue());
        }
        return res.json( planeamentoOrError.errorValue()).status(400).send();
      }

      const planeamento = planeamentoOrError.getValue();
      res.status(200);
      return res.json( planeamento );
    }
    catch (e) {
      return next(e);
    }
  }

}
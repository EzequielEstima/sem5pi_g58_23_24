import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";

import IPisoController from '../IControllers/IPisoController';
import IPisoService from '../../services/IServices/IPisoService';
import ICriarPisoDTO from '../../dto/ICriarPisoDTO';
import IPisoDTO from '../../dto/IPisoDTO';

import { Result } from "../../core/logic/Result";
import IEditarPisoDTO from '../../dto/IEditarPisoDTO';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import IAuthService from '../../services/IServices/IAuthService';

@Service()
export default class PisoController implements IPisoController {
  constructor(
      @Inject(config.services.piso.name) private pisoServiceInstance : IPisoService,
      @Inject(config.services.auth.name) private authServiceInstance : IAuthService
  ) {}
  async listarPisosComMapa(req: Request, res: Response, next: NextFunction) {
    try {
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus', 'gestor de frota', 'gestor de tarefas', 'utente', 'admin']);
      if(authOrError.isFailure){
        return res.send();
      }
      const pisoOrError = await this.pisoServiceInstance.listarPisosComMapa(req.query.codigo as string);
        
      if (pisoOrError.isFailure) {
        let message = String(pisoOrError.errorValue());
        if(message === "O edificio com o código " + req.query.codigo +" não existe" || message === "Não existem pisos nesse Edificio"){
          return res.status(404).json( pisoOrError.errorValue());
        }
        return res.json( pisoOrError.errorValue()).status(400).send();
      }

      const pisoDTO = pisoOrError.getValue();
      res.status(200);
      return res.json( pisoDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async criarPiso(req: Request, res: Response, next: NextFunction) {
    try {
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus']);
      if(authOrError.isFailure){
        return res.send();
      }
      const pisoOrError = await this.pisoServiceInstance.criarPiso(req.body as ICriarPisoDTO);
        
      if (pisoOrError.isFailure) {
        let message = String(pisoOrError.errorValue());
        if(message === "O edificio com o código " + req.body.codigo +" não existe"){
          res.status(404);
          return res.json( pisoOrError.errorValue());
        }
        return res.status(400).json( pisoOrError.errorValue());
      }

      const criarPisoDTO = pisoOrError.getValue();
      res.status(201);
      return res.json( criarPisoDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async listarTodosOsPisosDeUmEdificio(req: Request, res: Response, next: NextFunction) {
    try {
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus', 'utente']);
      if(authOrError.isFailure){
        return res.send();
      }
      const pisoOrError = await this.pisoServiceInstance.listarTodosOsPisosDeUmEdificio(req.query.codigo as string);
        
      if (pisoOrError.isFailure) {
        let message = String(pisoOrError.errorValue());
        if(message === "O edificio com o código " + req.query.codigo +" não existe" || message === "Não existem pisos nesse Edificio"){
          return res.status(404).json( pisoOrError.errorValue());
        }
        return res.json( pisoOrError.errorValue()).status(400).send();
      }

      const pisoDTO = pisoOrError.getValue();
      res.status(200);
      return res.json( pisoDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async editarPiso(req: Request, res: Response, next: NextFunction) {
    try {
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus']);
      if(authOrError.isFailure){
        return res.send();
      }
      const pisoOrError = await this.pisoServiceInstance.editarPiso(req.body as IEditarPisoDTO);
        
      if (pisoOrError.isFailure) {
        let message = String(pisoOrError.errorValue());
        if(message === "O edificio com o código " + req.body.codigoEdificio +" não existe" || 
              message === "O piso com o número " + req.body.numeroPiso +" não existe"){
          return res.status(404).json( pisoOrError.errorValue());
        }
        res.status(400);
        return res.json( pisoOrError.errorValue()).send();

      }

      const pisoDTO = pisoOrError.getValue();
      res.status(200);
      return res.json( pisoDTO );
    }catch (e) {
        return next(e);
    }
  }

  public async listarPisosServidosPorElevador(req: Request, res: Response, next: NextFunction) {
    try {
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus', 'gestor de frota', 'gestor de tarefas']);
      if(authOrError.isFailure){
        return res.send();
      }
      const pisoOrError = await this.pisoServiceInstance.listarPisosServidosPorElevador(req.query.codigoEd as string);
        
      if (pisoOrError.isFailure) {
        let message = String(pisoOrError.errorValue());
        if(message === "O edificio com o código " + req.query.codigoEd +" não existe" || message === "O elevador desse edificio não serve nenhum piso"){
          return res.status(404).json( pisoOrError.errorValue());
        }
        return res.json( pisoOrError.errorValue()).status(400).send();
      }

      const pisoDTO = pisoOrError.getValue();
      res.status(200);
      return res.json( pisoDTO );
    }
    catch (e) {
      return next(e);
    }
  };


}
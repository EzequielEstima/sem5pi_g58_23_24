import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";

import IUserController from '../IControllers/IUserController';
import IUserService from '../../services/IServices/IUserService';
import { IUserDTO } from '../../dto/IUserDTO';
import { ISignupUtenteDTO } from '../../dto/ISignupUtenteDTO';
import { IApproveOrRejectSignUpDTO } from '../../dto/IApproveOrRejectUtenteDTO';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { IUpdateUserDTO } from '../../dto/IUpdateUserDTO';
import IAuthService from '../../services/IServices/IAuthService';

@Service()
export default class UserController implements IUserController {
  constructor(
    @Inject(config.services.user.name) private userServiceInstance: IUserService,
    @Inject(config.services.auth.name) private authServiceInstance: IAuthService
  ) { }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userOrError = await this.userServiceInstance.SignIn(email, password);
      if (userOrError.isFailure) {
        let message = String(userOrError.errorValue());
        if (message === "User not found") {
          res.status(404);
          return res.json(userOrError.errorValue());
        }
        return res.status(400).json(userOrError.errorValue());
      }

      const userDTO = userOrError.getValue();
      return res.json(userDTO);
    }
    catch (e) {
      return next(e);
    }
  }
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const userOrError = await this.userServiceInstance.SignUp(req.body as IUserDTO);

      if (userOrError.isFailure) {
        let message = String(userOrError.errorValue());
        if (message === "Utilizador já existe com email " + req.body.email) {
          res.status(404);
          return res.json(userOrError.errorValue());
        }
        return res.status(400).json(userOrError.errorValue());
      }

      const userDTO = userOrError.getValue();
      res.status(201);
      return res.json(userDTO);
    }
    catch (e) {
      return next(e);
    }
  }

  async approveOrRejectSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['admin']);
      if(authOrError.isFailure){
        return res.send();
      }
      const userOrError = await this.userServiceInstance.approveOrRejectSignUp(req.body as IApproveOrRejectSignUpDTO);
      if (userOrError.isFailure) {
        let message = String(userOrError.errorValue());
        if (message === "Utilizador não existe com email " + req.body.email) {
          res.status(404);
          return res.json(userOrError.errorValue());
        }
        return res.status(400).json(userOrError.errorValue());
      }

      const userDTO = userOrError.getValue();
      return res.json(userDTO);
    }
    catch (e) {
      return next(e);
    }
  }

  async listarUtilizadoresPendentes(req: Request, res: Response, next: NextFunction) {
    try {
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['admin']);
      if(authOrError.isFailure){
        return res.send();
      }
      const userOrError = await this.userServiceInstance.listarUtilizadoresPendentes();
      if (userOrError.isFailure) {
        let message = String(userOrError.errorValue());
        if (message === "Não existem utilizadores pendentes") {
          res.status(404);
          return res.json(userOrError.errorValue());
        }
        return res.status(400).json(userOrError.errorValue());
      }
      const userDTO = userOrError.getValue();
      res.status(201);
      return res.json(userDTO);
    } catch (e) {
      return next(e);
    }
  }

  async signupUtente(req: Request, res: Response, next: NextFunction) {
    try {
      const userOrError = await this.userServiceInstance.signupUtente(req.body as ISignupUtenteDTO);

      if (userOrError.isFailure) {
        res.status(400);
        return res.json(userOrError.errorValue());
      }
      const userDTO = userOrError.getValue();
      res.status(201);
      return res.json(userDTO);
    }
    catch (e) {
      return next(e);
    }
  }


  public async delete(req: Request, res: Response, next: NextFunction) {
    let authOrError = this.authServiceInstance.checkAuth(req, res, ['admin']);
    if(authOrError.isFailure){
      return res.send();
    }
    try {
      let props = String(req.query.email);
      const userOrError = await this.userServiceInstance.delete(props);
      if (userOrError.isFailure) {
        res.status(402);
        return res.json(userOrError.errorValue());
      }
      const userDTO = userOrError.getValue();
      return res.json(userDTO);
    } catch (e) {
      throw next(e);
    }
  }

  public async alterarDadosUser(req: Request, res: Response, next: NextFunction){
    let authOrError = this.authServiceInstance.checkAuth(req, res, ['utente']);
    if(authOrError.isFailure){
      return res.send();
    }
    try{
      
      let email = this.authServiceInstance.obterEmail(req);
      let inputDTO = req.body as IUpdateUserDTO;
      inputDTO.email = email.getValue();
      
      const userOrError = await this.userServiceInstance.alterarDadosUser(inputDTO);
      
      if(userOrError.isFailure){
        if (String(userOrError.errorValue()) === "Não existe um utilizador com este email"){
          res.status(404);
          return res.json(userOrError.errorValue());
        }
        res.status(400);
        return res.json(userOrError.errorValue());
      }
      
      const userDTO = userOrError.getValue();
      res.status(200);
      return res.json(userDTO);
    
    } catch(e) {
      throw next(e);
    }
  }

  public async deleteUtente(req: Request, res: Response, next: NextFunction){
    let authOrError = this.authServiceInstance.checkAuth(req, res, ['utente']);
    if(authOrError.isFailure){
      return res.send();
    }
    try{
      let email =  this.authServiceInstance.obterEmail(req);
      if(email.isFailure){
        if(String(email.errorValue()) === "Sessão expirada"){
          res.status(440);
          return res.send();          
        }else{
          res.status(401);
          return res.send();
        }
      }
      const userOrError = await this.userServiceInstance.deleteUtente(email.getValue());
      if (userOrError.isFailure) {
        if (String(userOrError.errorValue()) === "Utilizador não existe"){
          res.status(404);
          return res.json(userOrError.errorValue());
        }
        res.status(400);
        return res.json(userOrError.errorValue());
      }
      const resposta = userOrError.getValue();
      res.status(200);
      return res.json(resposta);
    } catch(e) {
      throw next(e);
    }
  }
  public async copiaDadosPessoais(req: Request, res: Response, next: NextFunction){
    let authOrError = this.authServiceInstance.checkAuth(req, res, ['utente']);
    if(authOrError.isFailure){
      return res.send();
    }
    try{
      let email = this.authServiceInstance.obterEmail(req);
      if(email.isFailure){
        res.status(440);
        return res;
      }else{
        let dadosPessoaisOrFail = await this.userServiceInstance.copiaDadosPessoais(email.getValue());
        if(dadosPessoaisOrFail.isFailure){
          res.status(400);
          return res.json(dadosPessoaisOrFail.errorValue());
        }else{
          res.status(200);
          return res.json(dadosPessoaisOrFail.getValue());
        }
      }
    }catch(e){
      throw next(e);
    }
  }
}
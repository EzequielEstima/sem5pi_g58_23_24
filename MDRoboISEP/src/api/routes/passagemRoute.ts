import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IPassagemController from '../../controllers/IControllers/IPassagemController';

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/passagem', route);

  const ctrl = Container.get(config.controllers.passagem.name) as IPassagemController;

  route.post('',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
        codigoEdificioA: Joi.string().required(),
        codigoEdificioB: Joi.string().required(),
        numeroPisoA: Joi.number().required(),
        numeroPisoB: Joi.number().required(),
      })
    }),
    (req, res, next) => ctrl.criarPassagem(req, res, next));

  route.get('/listarPassagensPorParDeEdificios',
    celebrate({
      query: Joi.object({
        edificioACod: Joi.string().required(),
        edificioBCod: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.listarPassagensPorParDeEdificios(req, res, next));

  route.get('/listarPisosComPassagens',
    celebrate({
      body: Joi.object({
      })
    }),
    (req, res, next) => ctrl.listarPisosComPassagens(req, res, next));

  route.put('/editarPassagens',
    celebrate({
      body: Joi.object({
        id: Joi.number().required(),
        codigoEdificioA: Joi.string().required(),
        codigoEdificioB: Joi.string().required(),
        numeroPisoA: Joi.number().required(),
        numeroPisoB: Joi.number().required(),
      })
    }),
    (req, res, next) => ctrl.editarPassagens(req, res, next));
};
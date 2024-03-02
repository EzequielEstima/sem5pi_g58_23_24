import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IEdificioController from '../../controllers/IControllers/IEdificioController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/edificio', route);

  const ctrl = Container.get(config.controllers.edificio.name) as IEdificioController;

  route.post('',
    celebrate({
      body: Joi.object({
        codigo: Joi.string().required(),
        nome: Joi.string(),
        descricao: Joi.string(),
        dimensaoX: Joi.number().required(),
        dimensaoY: Joi.number().required(),
      })
    }),
    (req, res, next) => ctrl.criarEdificio(req, res, next));

    route.get('/listarMinEMaxPisos',
    celebrate({
      query: Joi.object({
        minPisos: Joi.number().required(),
        maxPisos: Joi.number().required(),
      })
    }),
    (req, res, next) => ctrl.listarEdificioMinEMaxPisos(req, res, next));

    route.get('',
    (req, res, next) => ctrl.listarEdificios(req, res, next));

    route.put('',
    celebrate({
      body: Joi.object({
        codigo: Joi.string().required(),
        nome: Joi.string(),
        descricao: Joi.string(),
      })
    }),
    (req, res, next) => ctrl.editarEdificio(req, res, next));

    route.delete('',
    celebrate({
      query: Joi.object({
        codEdificio: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.deleteEdificio(req, res, next));

    route.get('/getInformacaoPlaneamento',
    celebrate({
      body: Joi.object({
      })
    }),
    (req, res, next) => ctrl.getInformacaoPlaneamento(req, res, next));
};
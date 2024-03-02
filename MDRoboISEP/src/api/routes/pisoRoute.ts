import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IPisoController from '../../controllers/IControllers/IPisoController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/piso', route);

  const ctrl = Container.get(config.controllers.piso.name) as IPisoController;

  route.post('',
    celebrate({
      body: Joi.object({
        codigo: Joi.string().required(),
        numeroPiso: Joi.number().required(),
        descricaoPiso: Joi.string()
      })
    }),
    (req, res, next) => ctrl.criarPiso(req, res, next) );
  
    route.get('',
    celebrate({
      query: Joi.object({
        codigo: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.listarTodosOsPisosDeUmEdificio(req, res, next)
  );

    route.put('',
    celebrate({
      body: Joi.object({
        codigoEdificio: Joi.string().required(),
        numeroPiso: Joi.number().required(),
        novoNumeroPiso: Joi.number(),
	      descricaoPiso: Joi.string()
      })
    }),
    (req, res, next) => ctrl.editarPiso(req, res, next) );

    route.get('/pisosComMapa',
    celebrate({
      query: Joi.object({
        codigo: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.listarPisosComMapa(req, res, next) );

    route.get('/pisosServidosPorElevador',
    celebrate({
      query: Joi.object({
        codigoEd: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.listarPisosServidosPorElevador(req, res, next) );
  
};
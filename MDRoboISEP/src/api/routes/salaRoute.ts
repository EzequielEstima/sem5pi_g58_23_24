import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ISalaController from '../../controllers/IControllers/ISalaController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/sala', route);

  const ctrl = Container.get(config.controllers.sala.name) as ISalaController;

  route.post('',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        codigoEdificio: Joi.string().required(),
        numeroPiso: Joi.number().required(),
        descricao: Joi.string(),
        categoria: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.criarSala(req, res, next) );
  
};
import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ITipoDispositivoController from '../../controllers/IControllers/ITipoDispositivoController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/tipoDispositivo', route);

  const ctrl = Container.get(config.controllers.tipoDispositivo.name) as ITipoDispositivoController;

  route.post('',
    celebrate({
        body: Joi.object({
        tipoTarefa: Joi.array().items(Joi.string()).required().min(1),
        marca: Joi.string().required(),
        modelo: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.criarTipoDispositivo(req, res, next));

    route.delete('',
    celebrate({
      query: Joi.object({
        idTipoDispositivo: Joi.number().required(),
      })
    }),
    (req, res, next) => ctrl.deleteTipoDispositivo(req, res, next));
};
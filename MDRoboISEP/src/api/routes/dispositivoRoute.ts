import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IDispositivoController from '../../controllers/IControllers/IDispositivoController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/dispositivo', route);

  const ctrl = Container.get(config.controllers.dispositivo.name) as IDispositivoController;

  route.post('',
    celebrate({
      body: Joi.object({
        codigo: Joi.string().required(),
        descricaoDispositivo: Joi.string(),
        nickname: Joi.string().required(),
        tipoDispositivo: Joi.number().required(),
        numeroSerie: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.adicionarDispositivoAFrota(req, res, next));

    route.get('',
    (req, res, next) => ctrl.listarDispositivosDaFrota(req, res, next));

    route.patch('/inibir',
    celebrate({
      body: Joi.object({
        codigo: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.inibirDispositivo(req, res, next));

    route.get('/tipoTarefa',
    (req, res, next) => ctrl.listarCodigoDosDispositivosDaFrotaPorTarefa(req, res, next));
}
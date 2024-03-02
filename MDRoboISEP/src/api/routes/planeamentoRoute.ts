import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import Container from 'typedi';
import config from "../../../config";
import IPlaneamentoController from '../../controllers/IControllers/IPlaneamentoController';

const route = Router();

export default (app: Router) => {
    
    app.use('/planeamento',route);

    const ctrl = Container.get(config.controllers.planeamento.name) as IPlaneamentoController
        
    route.get('/caminhoEntreEdificios',
        celebrate({
            query: Joi.object({
                salaInicial: Joi.string().required(),
                salaFinal: Joi.string().required(),
            })
        }),
        (req, res, next) => ctrl.encontrarCaminhosEntreEdificios(req, res, next));

    route.get('/caminhoVigilancia',
        celebrate({
            query: Joi.object({
                codigoEd: Joi.string().required(),
                numeroPiso: Joi.string().required(),
            })
        }),
        (req, res, next) => ctrl.encontrarCaminhoVigilancia(req, res, next));
};
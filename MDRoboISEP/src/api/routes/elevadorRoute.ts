import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import Container from 'typedi';
import config from "../../../config";
import IElevadorController from '../../controllers/IControllers/IElevadorController';

const route = Router();

export default (app: Router) => {
    
    app.use('/elevador',route);

    const ctrl = Container.get(config.controllers.elevador.name) as IElevadorController

    route.post('',
        celebrate({
            body: Joi.object({
                edificio: Joi.string().required(),
                pisosServidos: Joi.array().items(Joi.number()).required().min(2),
                marca: Joi.string(),
                modelo: Joi.string(),
                numeroSerie: Joi.string(),
                descricao: Joi.string()
            })
        }),
        (req, res, next) => ctrl.criarElevador(req, res, next));

        route.put('',
        celebrate({
            body: Joi.object({
                edificio: Joi.string().required(),
                pisosServidos: Joi.array().items(Joi.number()).min(2),
                marca: Joi.string(),
                modelo: Joi.string(),
                numeroSerie: Joi.string(),
                descricao: Joi.string()
            })
        }),
        (req, res, next) => ctrl.editarElevador(req, res, next));

        route.get('/elevadoresPorEdificio',
        celebrate({
            query: Joi.object({
                edificio: Joi.string().required(),
            })
        }),
        (req, res, next) => ctrl.listarElevadoresDoEdificio(req, res, next));
};
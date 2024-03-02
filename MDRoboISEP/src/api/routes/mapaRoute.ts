import { Router } from "express";
import IMapaController from "../../controllers/IControllers/IMapaController";
import config from "../../../config";
import Container from "typedi";
import { Joi, celebrate } from "celebrate";

const route = Router();

export default (app: Router) => {
    app.use("/mapa", route);

    const ctrl = Container.get(config.controllers.mapa.name) as IMapaController;

    route.patch('',
        celebrate({
            body: Joi.object({
                codigoEdificio: Joi.string().required(),
                numeroPiso: Joi.number().required(),
                passagens : Joi.array().items(Joi.object({
                    id : Joi.number().required(),
                    abcissa : Joi.number().required(),
                    ordenada : Joi.number().required(),
                    orientacao : Joi.string().required()
                })),
                elevador : Joi.object({
                    xCoord : Joi.number().required(),
                    yCoord : Joi.number().required(),
                    orientacao : Joi.string().required()
                }),
                salas : Joi.array().items(Joi.object({
                    nome : Joi.string().required(),
                    abcissaA : Joi.number().required(),
                    ordenadaA : Joi.number().required(),
                    abcissaB : Joi.number().required(),
                    ordenadaB : Joi.number().required(),
                    abcissaPorta : Joi.number().required(),
                    ordenadaPorta : Joi.number().required(),
                    orientacaoPorta : Joi.string().required()
                }))
            })
        }),
        (req, res, next) => ctrl.carregarMapa(req, res, next));

        route.get('',
        celebrate({
            query: Joi.object({
                codEdificio: Joi.string().required(),
                numPiso : Joi.string().required()
            })
        }),
        (req, res, next) => ctrl.exportarMapa(req, res, next));

        route.get('/atravesDeUmaPassagemEPiso',
        celebrate({
            query: Joi.object({
                idPassagem: Joi.number().required(),
                codEd : Joi.string().required(),
                numeroPiso : Joi.number().required()
            })
        }),
        (req, res, next) => ctrl.exportarMapaAtravesDeUmaPassagemEPiso(req, res, next));

        route.post('/exportarMapaParaOPlaneamento',
        celebrate({
            body: Joi.object({
            })
        }),
        (req, res, next) => ctrl.exportarMapaParaOPlaneamento(req, res, next));
    };

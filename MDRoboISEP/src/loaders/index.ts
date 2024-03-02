import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';
import SalaRepo from '../repos/SalaRepo';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userSchema = {
    // compare with the approach followed in repos and services
    name: 'userSchema',
    schema: '../persistence/schemas/userSchema',
  };

  const roleSchema = {
    // compare with the approach followed in repos and services
    name: 'roleSchema',
    schema: '../persistence/schemas/roleSchema',
  };

  const pisoSchema = {
    // compare with the approach followed in repos and services
    name: 'PisoSchema',
    schema: '../persistence/schemas/PisoSchema',
  };

  const pontoSchema = {
    // compare with the approach followed in repos and services
    name: 'PontoSchema',
    schema: '../persistence/schemas/PontoSchema',
  };

  const EdificioSchema = {
    name: 'EdificioSchema',
    schema: '../persistence/schemas/EdificioSchema',
  }

  const elevadorSchema = {
    // compare with the approach followed in repos and services
    name: 'ElevadorSchema',
    schema: '../persistence/schemas/ElevadorSchema',
  };

  const tipoDispositivoSchema = {
    // compare with the approach followed in repos and services
    name: 'TipoDispositivoSchema',
    schema: '../persistence/schemas/TipoDispositivoSchema',
  };

  const passagemSchema = {
    // compare with the approach followed in repos and services
    name: 'PassagemSchema',
    schema: '../persistence/schemas/PassagemSchema',
  };
  const dispositivoSchema = {
    // compare with the approach followed in repos and services
    name: 'DispositivoSchema',
    schema: '../persistence/schemas/DispositivoSchema',
  };
  const salaSchema = {
    // compare with the approach followed in repos and services
    name: 'SalaSchema',
    schema: '../persistence/schemas/SalaSchema',
  };
  const mapaSchema = {
    // compare with the approach followed in repos and services
    name: 'MapaSchema',
    schema: '../persistence/schemas/MapaSchema',
  };


  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const edificioController = {
    name: config.controllers.edificio.name,
    path: config.controllers.edificio.path
  }

  const pisoController = {
    name: config.controllers.piso.name,
    path: config.controllers.piso.path
  }

  const elevadorController = {
    name: config.controllers.elevador.name,
    path: config.controllers.elevador.path
  }

  const tipoDispositivoController = {
    name: config.controllers.tipoDispositivo.name,
    path: config.controllers.tipoDispositivo.path
  }

  const passagemController = {
    name: config.controllers.passagem.name,
    path: config.controllers.passagem.path
  }

  const dispositivoController = {
    name: config.controllers.dispositivo.name,
    path: config.controllers.dispositivo.path
  }

  const salaController = {
    name: config.controllers.sala.name,
    path: config.controllers.sala.path
  }

  const pontoController = {
    name: config.controllers.ponto.name,
    path: config.controllers.ponto.path
  }

  const mapaController = {
    name: config.controllers.mapa.name,
    path: config.controllers.mapa.path
  }

  const planeamentoController = {
    name: config.controllers.planeamento.name,
    path: config.controllers.planeamento.path
  }
  
  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  }

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }
  const pisoRepo = {
    name: config.repos.piso.name,
    path: config.repos.piso.path
  }

  const pontoRepo = {
    name: config.repos.ponto.name,
    path: config.repos.ponto.path
  }

  const edificioRepo = {
    name: config.repos.edificio.name,
    path: config.repos.edificio.path
  }

  const elevadorRepo = {
    name: config.repos.elevador.name,
    path: config.repos.elevador.path
  }
  const tipoDispositivoRepo = {
    name: config.repos.tipoDispositivo.name,
    path: config.repos.tipoDispositivo.path
  }

  const passagemRepo = {
    name: config.repos.passagem.name,
    path: config.repos.passagem.path
  }

  const dispositivoRepo = {
    name: config.repos.dispositivo.name,
    path: config.repos.dispositivo.path
  }

  const salaRepo = {
    name: config.repos.sala.name,
    path: config.repos.sala.path
  }
  const mapaRepo = {
    name: config.repos.mapa.name,
    path: config.repos.mapa.path
  }

  const authService = {
    name: config.services.auth.name,
    path: config.services.auth.path
  }
  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }

  const edificioService = {
    name: config.services.edificio.name,
    path: config.services.edificio.path
  }

  const pisoService = {
    name: config.services.piso.name,
    path: config.services.piso.path
  }

  const elevadorService = {
    name: config.services.elevador.name,
    path: config.services.elevador.path
  }

  const tipoDispositivoService = {
    name: config.services.tipoDispositivo.name,
    path: config.services.tipoDispositivo.path
  }

  const passagemService = {
    name: config.services.passagem.name,
    path: config.services.passagem.path
  }

  const dispositivoService = {
    name: config.services.dispositivo.name,
    path: config.services.dispositivo.path
  }

  const salaService = {
    name: config.services.sala.name,
    path: config.services.sala.path
  }

  const pontoService = {
    name: config.services.ponto.name,
    path: config.services.ponto.path
  }

  const mapaService = {
    name: config.services.mapa.name,
    path: config.services.mapa.path
  }

  const planeamentoService = {
    name: config.services.planeamento.name,
    path: config.services.planeamento.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      pisoSchema,
      pontoSchema,
      EdificioSchema,
      elevadorSchema,
      tipoDispositivoSchema,
      passagemSchema,
      dispositivoSchema,
      salaSchema,
      mapaSchema
    ],
    controllers: [
      roleController,
      edificioController,
      pisoController,
      elevadorController,
      tipoDispositivoController,
      passagemController,
      dispositivoController,
      salaController,
      mapaController,
      planeamentoController
    ],
    repos: [
      roleRepo,
      userRepo,
      pisoRepo,
      pontoRepo,
      edificioRepo,
      elevadorRepo,
      tipoDispositivoRepo,
      passagemRepo,
      dispositivoRepo,
      salaRepo,
      mapaRepo
    ],
    services: [
      authService,
      roleService,
      edificioService,
      elevadorService,
      pisoService,
      tipoDispositivoService,
      passagemService,
      dispositivoService,
      salaService,
      mapaService,
      planeamentoService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};

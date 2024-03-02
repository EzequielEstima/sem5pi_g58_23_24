import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb+srv://Admin:1234@sem5pi-g58-2324.iswl0yf.mongodb.net/?retryWrites=true&w=majority",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    edificio: {
      name: "EdificioController",
      path: "../controllers/ImplControllers/EdificioController"
    },
    role: {
      name: "RoleController",
      path: "../controllers/ImplControllers/roleController"
    },
    piso: {
      name: "PisoController",
      path: "../controllers/ImplControllers/PisoController"
    },
    elevador: {
      name: "ElevadorController",
      path: "../controllers/ImplControllers/ElevadorController"
    },
    tipoDispositivo: {
      name: "TipoDispositivoController",
      path: "../controllers/ImplControllers/TipoDispositivoController"
    },
    passagem: {
      name: "PassagemController",
      path: "../controllers/ImplControllers/PassagemController"
    },
    dispositivo: {
      name: "DispositivoController",
      path: "../controllers/ImplControllers/DispositivoController"
    },
    sala : {
      name: "SalaController",
      path: "../controllers/ImplControllers/SalaController"
    },
    ponto : {
      name: "PontoController",
      path: "../controllers/ImplControllers/PontoController"
    },
    mapa : {
      name: "MapaController",
      path: "../controllers/ImplControllers/MapaController"
    },
    planeamento : {
      name: "PlaneamentoController",
      path: "../controllers/ImplControllers/PlaneamentoController"
    },
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    },
    edificio: {
      name: "EdificioRepo",
      path: "../repos/EdificioRepo"
    },
    piso: {
      name: "PisoRepo",
      path: "../repos/PisoRepo"
    },
    ponto: {
      name: "PontoRepo",
      path: "../repos/PontoRepo"
    },
    elevador: {
      name: "ElevadorRepo",
      path: "../repos/ElevadorRepo"
    },
    tipoDispositivo: {
      name: "TipoDispositivoRepo",
      path: "../repos/TipoDispositivoRepo"
    },
    passagem: {
      name: "PassagemRepo",
      path: "../repos/PassagemRepo"
    },
    dispositivo: {
      name: "DispositivoRepo",
      path: "../repos/DispositivoRepo"
    },
    sala: {
      name: "SalaRepo",
      path: "../repos/SalaRepo"
    },
    mapa: {
      name: "MapaRepo",
      path: "../repos/MapaRepo"
    },
  },

  services: {
    auth: {
      name: "AuthService",
      path: "../services/ImplServices/authService"
    },
    edificio: {
      name: "EdificioService",
      path: "../services/ImplServices/EdificioService"
    },
    role: {
      name: "RoleService",
      path: "../services/ImplServices/roleService"
    },
    piso: {
      name: "PisoService",
      path: "../services/ImplServices/PisoService"
    },
    elevador: {
      name: "ElevadorService",
      path: "../services/ImplServices/ElevadorService"
    },
    tipoDispositivo: {
      name: "TipoDispositivoService",
      path: "../services/ImplServices/TipoDispositivoService"
    },
    passagem: {
      name: "PassagemService",
      path: "../services/ImplServices/PassagemService"
    },
    dispositivo: {
      name: "DispositivoService",
      path: "../services/ImplServices/DispositivoService"
    },
    sala: {
      name: "SalaService",
      path: "../services/ImplServices/SalaService"
    },
    ponto: {
      name: "PontoService",
      path: "../services/ImplServices/PontoService"
    },
    mapa: {
      name: "MapaService",
      path: "../services/ImplServices/MapaService"
    },
    planeamento: {
      name: "PlaneamentoService",
      path: "../services/ImplServices/PlaneamentoService"
    },
  },
};

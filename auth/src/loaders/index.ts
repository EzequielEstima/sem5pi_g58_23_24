import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userSchema = {
    // compare with the approach followed in repos and services
    name: 'userSchema',
    schema: '../persistence/schemas/userSchema',
  };

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }

  const userController = {
    name: config.controllers.user.name,
    path: config.controllers.user.path
  }

  const userService = {
    name: config.services.user.name,
    path: config.services.user.path
  }

  const authService = {
    name: config.services.auth.name,
    path: config.services.auth.path
  }


  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
    ],
    controllers: [
      userController,
    ],
    repos: [
      userRepo,
    ],
    services: [
      userService,
      authService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};

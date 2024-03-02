import { expect } from "chai";
import 'mocha';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import  AuthService from "../../src/services/ImplServices/AuthService";
import jwt from 'jsonwebtoken';
import config from '../../config';

describe('AuthService ', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        Container.reset();
    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });


    it('Token com email e role corretas e com timeout futuro é aceite', async () => {
        let token = jwt.sign({
              id: 123,
              email: "default@email.com", // We are gonna use this in the middleware 'isAuth'
              role: "gestor de tarefas",
              firstName: "nome1",
              lastName: "nome2",
              exp: 2524608000000,
            },
            config.jwtSecret,
          );
          let req: any = {};
          let res: any = {
            status: sandbox.stub().returnsThis(), // Spy on status method
            json: sandbox.stub(), // Spy on json method
          };
          req.headers = { "authorization": "Bearer " + token };
        const authService = new AuthService();
        let answer = authService.checkAuth(req, res, ['gestor de tarefas']);
        expect(answer.isSuccess).to.equal(true);
    });

    it('Token sem e-mail não é a ceite', async () => {
        let token = jwt.sign({
              id: 123,
              email: undefined, // We are gonna use this in the middleware 'isAuth'
              role: "gestor de tarefas",
              firstName: "nome1",
              lastName: "nome2",
              exp: 2524608000000,
            },
            config.jwtSecret,
          );
          let req: any = {};
          let res: any = {
            status: sandbox.stub().returnsThis(), // Spy on status method
            json: sandbox.stub(), // Spy on json method
          };
          req.headers = { "authorization": "Bearer " + token };
        const authService = new AuthService();
        let answer = authService.checkAuth(req, res, ['gestor de tarefas']);
        expect(answer.isSuccess).to.equal(false);
    });

    it('Token sem role não é a ceite', async () => {
        let token = jwt.sign({
              id: 123,
              email: "default@email.com", // We are gonna use this in the middleware 'isAuth'
              role: undefined,
              firstName: "nome1",
              lastName: "nome2",
              exp: 2524608000000,
            },
            config.jwtSecret,
          );
          let req: any = {};
          let res: any = {
            status: sandbox.stub().returnsThis(), // Spy on status method
            json: sandbox.stub(), // Spy on json method
          };
          req.headers = { "authorization": "Bearer " + token };
        const authService = new AuthService();
        let answer = authService.checkAuth(req, res, ['gestor de tarefas']);
        expect(answer.isSuccess).to.equal(false);
    });

    it('Token com expiração já passou não é aceite', async () => {
        let token = jwt.sign({
              id: 123,
              email: "default@email.com", // We are gonna use this in the middleware 'isAuth'
              role: "gestor de tarefas",
              firstName: "nome1",
              lastName: "nome2",
              exp: 20,
            },
            config.jwtSecret,
          );
          let req: any = {};
          let res: any = {
            status: sandbox.stub().returnsThis(), // Spy on status method
            json: sandbox.stub(), // Spy on json method
          };
          req.headers = { "authorization": "Bearer " + token };
        const authService = new AuthService();
        let answer = authService.checkAuth(req, res, ['gestor de tarefas']);
        expect(answer.isSuccess).to.equal(false);
    });

    it('Token com roles incorretas não é aceite', async () => {
        let token = jwt.sign({
              id: 123,
              email: "default@email.com", // We are gonna use this in the middleware 'isAuth'
              role: "gestor de campus",
              firstName: "nome1",
              lastName: "nome2",
              exp: 2524608000000,
            },
            config.jwtSecret,
          );
          let req: any = {};
          let res: any = {
            status: sandbox.stub().returnsThis(), // Spy on status method
            json: sandbox.stub(), // Spy on json method
          };
          req.headers = { "authorization": "Bearer " + token };
        const authService = new AuthService();
        let answer = authService.checkAuth(req, res, ['gestor de tarefas']);
        expect(answer.isSuccess).to.equal(false);
    });


    it('obter email retorna o email', async () => {
      let token = jwt.sign({
            id: 123,
            email: "default@email.com", // We are gonna use this in the middleware 'isAuth'
            role: "gestor de tarefas",
            firstName: "nome1",
            lastName: "nome2",
            exp: 2524608000000,
          },
          config.jwtSecret,
        );
        let req: any = {};
        req.headers = { "authorization": "Bearer " + token };
      const authService = new AuthService();
      let answer = authService.obterEmail(req);
      expect(answer.isSuccess).to.equal(true);
      expect(answer.getValue()).to.equal("default@email.com");
  });
});

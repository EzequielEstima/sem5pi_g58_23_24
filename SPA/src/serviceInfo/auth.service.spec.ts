import { devEnvironment } from 'src/environments/environment.development';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { DadosPessoaisUser } from 'src/dataModel/dadosPessoaisUser';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('AuthService', () => {

  let service: AuthService;
  let httpClient: HttpClient;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
  });




  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método signupUtente chama o método post do HttpClient', () => {
    const testData = {
      name: "name",
      email: "email@isep.ipp.pt",
      telefone: "123432123",
      password: "Password10@",
      nif: "123123123",

    }
    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.signupUtente(testData.name, testData.email, testData.telefone, testData.nif, testData.password);
    expect(postSpy).toHaveBeenCalledWith(devEnvironment.AUTH_API_URL + 'user/signupUtente', testData, service.httpOptions);
  });

  it('Método signupUtente não chama o método post do HttpClient caso haja dados por preencher', () => {
    let name: string = "";
    const testData = {
      email: "email@isep.ipp.pt",
      telefone: "123432123",
      password: "Password10@",
      nif: "123123123",

    }
    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.signupUtente(name, testData.email, testData.telefone, testData.nif, testData.password);
    expect(postSpy).toHaveBeenCalledTimes(0);
  });

  it('Método signup chama o método post do HttpClient', () => {
    const testData = {
      name: "name",
      email: "email@isep.ipp.pt",
      telefone: "123432123",
      password: "Password10@",
      estado: "aceito",
      role: "admin",
      nif: "123123123",
    }
    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));
    service.signUp(testData.name, testData.email, testData.telefone, testData.nif, testData.password, testData.role);
    expect(postSpy).toHaveBeenCalledWith(devEnvironment.AUTH_API_URL + "user/signup", testData, service.httpOptions);
  });

  it('Método login chama o método post do HttpClient', () => {
    const inputData = {
      email: "email@isep.ipp.pt",
      password: "Password10@",
    }

    const returnData = {
      user: { nome : "user", role : "admin" },
      token: "token"
    }

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnData));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    service.login(inputData.email, inputData.password);
    expect(postSpy).toHaveBeenCalledWith(devEnvironment.AUTH_API_URL + "user/login", inputData,);
    expect(navigateSpy).toHaveBeenCalledWith(['/administrador']);
  });

  it('Método login não chama o método post do HttpClient caso não exista email', () => {
    const inputData = {
      email: "email@isep.ipp.pt",
      password: "Password10@",
    }

    const returnData = {
      user: { nome : "user", role : "admin" },
      token: "token"
    }

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnData));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    service.login(inputData.email, inputData.password);
    expect(postSpy).toHaveBeenCalledWith(devEnvironment.AUTH_API_URL + "user/login", inputData,);
    expect(navigateSpy).toHaveBeenCalledWith(['/administrador']);
  });

  it('Método login não chama o método post do HttpClient caso não exista email', () => {
    const inputData = {
      email: "",
      password: "Password10@",
    }

    const returnData = {
      user: { nome : "user", role : "admin" },
      token: "token"
    }

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnData));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    service.login(inputData.email, inputData.password);
    expect(postSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('Método login não chama o método post do HttpClient caso não exista password', () => {
    const inputData = {
      email: "",
      password: "Password10@",
    }

    const returnData = {
      user: { nome : "user", role : "admin" },
      token: "token"
    }

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnData));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    service.login(inputData.email, inputData.password);
    expect(postSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('Método alterarDadosUtente chama método PUT do HttpClient', () => {
    const inputData = {
      name: "name",
      telefone: "966432123",
      nif: "123123123",
    }

    const returnData = {
      name: "name",
      telefone: "966432123",
      nif: "123123123",
    }

    const postSpy = spyOn(httpClient, 'put').and.returnValue(of(returnData));
    
    service.alterarDadosUtente(inputData.name, inputData.telefone, inputData.nif);
    expect(postSpy).toHaveBeenCalledWith(devEnvironment.AUTH_API_URL + "user", inputData, service.httpOptions);
  });

  it('Método deleteUtente chama método delete do HttpClient', () => {
    
    let returnData = "User deleted";

    const deleteSpy = spyOn(httpClient, 'delete').and.returnValue(of(returnData));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    service.deleteUtente();
    expect(deleteSpy).toHaveBeenCalledWith(devEnvironment.AUTH_API_URL + "user/utente", service.httpOptions);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  }); 

  it('Método approveOrReject chama método PUT do HttpClient', () => {
    const inputData = {
      email: "user@isep.ipp.pt",
      estado: "aceito",
    }

    const postSpy = spyOn(httpClient, 'patch').and.returnValue(of("certo"));
    service.approveOrReject(inputData.email, inputData.estado);
    expect(postSpy).toHaveBeenCalledWith(devEnvironment.AUTH_API_URL + "user/approveOrReject", inputData, service.httpOptions);
  });

  it('Método listarUtilizadoresPendentes chama método GET do HttpClient', () => {
    const returnData =
      [
        {
          email: "user@isep.ipp.pt",
          name: "name",
          telefone: "966432123",
          nif: "123123123",
        }
      ];

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(returnData));
    service.listarUtilizadoresPendentes();
    expect(getSpy).toHaveBeenCalledWith(devEnvironment.AUTH_API_URL + "user/listarUtilizadoresPendentes", service.httpOptions);
  }
  );


});

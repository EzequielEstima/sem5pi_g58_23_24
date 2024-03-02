import { TestBed } from '@angular/core/testing';

import { DispositivoService } from './dispositivo.service';
import { HttpClient } from '@angular/common/http';
import { devEnvironment } from 'src/environments/environment.development';
import { Dispositivo } from 'src/dataModel/dispositivo';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';


describe('DispositivoServiceService', () => {
  let service: DispositivoService;
  let httpClient: HttpClient;

  const dispositivoUrl = devEnvironment.MDRI_API_URL + 'dispositivo';
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule]
    });
    service = TestBed.inject(DispositivoService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método listarDispositivosFrota chama o método get do HttpClient', () => {
    const testData: Dispositivo = {
      tipoDispositivo: 1,
      codigo: 'cod',
      descricaoDispositivo: 'desc',
      estado: true,
      nickname: 'nick',
      numeroSerie: '123'
    };

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));

    service.listarDispositivosFrota();
    expect(getSpy).toHaveBeenCalled();
  });

  it('Método adicionarDispositivoAFrota  chama o método post do HttpClient', () => {
  const testInsertData = {
    codigo: "A",
    nickname: "nick",
    idTipoDispositivo: "1",
    numeroSerie: "123",
    descricao: "descricao"
  };

  const testExpectedData = {
    codigo: "A",
    nickname: "nick",
    tipoDispositivo: 1,
    numeroSerie: "123",
    descricaoDispositivo: "descricao"
  };
  
  const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testExpectedData));

  service.adicionarDispositivoAFrota(testInsertData.codigo, testInsertData.nickname, testInsertData.idTipoDispositivo, testInsertData.numeroSerie, testInsertData.descricao);

  expect(postSpy).toHaveBeenCalledWith(dispositivoUrl,testExpectedData,service.httpOptions);
  });

  it('Método adicionarDispositivoAFrota não chama o método post do HttpClient se o codigo for vazio', () => {
    const testInsertData = {
      codigo: "",
      nickname: "nick",
      idTipoDispositivo: "1",
      numeroSerie: "123",
      descricao: "descricao"
    };
  
    const postSpy = spyOn(httpClient, 'post');
  
    service.adicionarDispositivoAFrota(testInsertData.codigo, testInsertData.nickname, testInsertData.idTipoDispositivo, testInsertData.numeroSerie, testInsertData.descricao);
  
    expect(postSpy).not.toHaveBeenCalled();
    });

    it('Método adicionarDispositivoAFrota não chama o método post do HttpClient se o nickname for vazio', () => {
      const testInsertData = {
        codigo: "W",
        nickname: "",
        idTipoDispositivo: "1",
        numeroSerie: "123",
        descricao: "descricao"
      };
    
      const postSpy = spyOn(httpClient, 'post');
    
      service.adicionarDispositivoAFrota(testInsertData.codigo, testInsertData.nickname, testInsertData.idTipoDispositivo, testInsertData.numeroSerie, testInsertData.descricao);
    
      expect(postSpy).not.toHaveBeenCalled();
    });

    it('Método adicionarDispositivoAFrota não chama o método post do HttpClient se o idTipoDispositivo for vazio', () => {
      const testInsertData = {
        codigo: "W",
        nickname: "nick",
        idTipoDispositivo: "",
        numeroSerie: "123",
        descricao: "descricao"
      };
    
      const postSpy = spyOn(httpClient, 'post');
    
      service.adicionarDispositivoAFrota(testInsertData.codigo, testInsertData.nickname, testInsertData.idTipoDispositivo, testInsertData.numeroSerie, testInsertData.descricao);
    
      expect(postSpy).not.toHaveBeenCalled();
    });

    it('Método adicionarDispositivoAFrota não chama o método post do HttpClient se o numeroSerie for vazio', () => {
      const testInsertData = {
        codigo: "W",
        nickname: "nick",
        idTipoDispositivo: "1",
        numeroSerie: "",
        descricao: "descricao"
      };
    
      const postSpy = spyOn(httpClient, 'post');
    
      service.adicionarDispositivoAFrota(testInsertData.codigo, testInsertData.nickname, testInsertData.idTipoDispositivo, testInsertData.numeroSerie, testInsertData.descricao);
    
      expect(postSpy).not.toHaveBeenCalled();
    });
});

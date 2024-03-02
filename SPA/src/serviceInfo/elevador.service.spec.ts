import { TestBed } from '@angular/core/testing';

import { ElevadorService } from './elevador.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Elevador } from 'src/dataModel/elevador';
import { of } from 'rxjs';
import { devEnvironment } from 'src/environments/environment.development';

describe('ElevadorService', () => {
  let service: ElevadorService;
  let httpClient: HttpClient;

  const elevadorUrl = devEnvironment.MDRI_API_URL + 'elevador';  
  const listarElevadorUrl = elevadorUrl + '/elevadoresPorEdificio';
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule]
    });
    service = TestBed.inject(ElevadorService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método criarElevador chama o método POST do HttpClient', () => {
    const testData: Elevador = {
      edificio: "A",
      pisosServidos: [1,2,3],
      marca: "marca",
      modelo: "modelo",
      numeroSerie: "numeroSerie",
      descricao: "descricao"
    };

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarElevador(testData.edificio, testData.pisosServidos, testData.marca, testData.modelo, testData.numeroSerie, testData.descricao);
    
    expect(postSpy).toHaveBeenCalledWith(elevadorUrl,testData,service.httpOptions);
  });

  it('Método criarElevador não chama o método POST do HttpClient sem ter um código de edifício', () => {
    const testData: Elevador = {
      edificio: "",
      pisosServidos: [1,2,3],
      marca: "marca",
      modelo: "modelo",
      numeroSerie: "numeroSerie",
      descricao: "descricao"
    };

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarElevador(testData.edificio, testData.pisosServidos, testData.marca, testData.modelo, testData.numeroSerie, testData.descricao);
    
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarElevador não chama o método POST do HttpClient quando é selecionado apenas 1 piso', () => {
    const testData: Elevador = {
      edificio: "A",
      pisosServidos: [1],
      marca: "marca",
      modelo: "modelo",
      numeroSerie: "numeroSerie",
      descricao: "descricao"
    };

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarElevador(testData.edificio, testData.pisosServidos, testData.marca, testData.modelo, testData.numeroSerie, testData.descricao);
    
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarElevador não chama o método POST do HttpClient quando não é selecionado nenhum piso', () => {
    const testData: Elevador = {
      edificio: "A",
      pisosServidos: [],
      marca: "marca",
      modelo: "modelo",
      numeroSerie: "numeroSerie",
      descricao: "descricao"
    };

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarElevador(testData.edificio, testData.pisosServidos, testData.marca, testData.modelo, testData.numeroSerie, testData.descricao);
    
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método editarElevador chama o método PUT do HttpClient', () => {
    const testData: Elevador = {
      edificio: "A",
      pisosServidos: [1,2,3],
      marca: "marca",
      modelo: "modelo",
      numeroSerie: "numeroSerie",
      descricao: "descricao"
    };

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarElevador(testData.edificio, testData.pisosServidos, testData.marca, testData.modelo, testData.numeroSerie, testData.descricao);
    
    expect(putSpy).toHaveBeenCalledWith(elevadorUrl,testData,service.httpOptions);
  });

  it('Método editarElevador não chama o método PUT do HttpClient caso o código do edificio seja vazio', () => {
    const testData: Elevador = {
      edificio: "",
      pisosServidos: [1,2,3],
      marca: "marca",
      modelo: "modelo",
      numeroSerie: "numeroSerie",
      descricao: "descricao"
    };

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarElevador(testData.edificio, testData.pisosServidos, testData.marca, testData.modelo, testData.numeroSerie, testData.descricao);
    
    expect(putSpy).not.toHaveBeenCalled();
  });

  it('Método editarElevador não chama o método PUT do HttpClient caso seja selecionado apenas um piso', () => {
    const testData: Elevador = {
      edificio: "A",
      pisosServidos: [1],
      marca: "marca",
      modelo: "modelo",
      numeroSerie: "numeroSerie",
      descricao: "descricao"
    };

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarElevador(testData.edificio, testData.pisosServidos, testData.marca, testData.modelo, testData.numeroSerie, testData.descricao);
    
    expect(putSpy).not.toHaveBeenCalled();
  });

  it('Método listarElevadores chama o método get do HttpClient', () => {
    const testData: Elevador = {
      edificio: "A",
      pisosServidos: [1,2],
      marca: "marca",
      modelo: "modelo",
      numeroSerie: "numeroSerie",
      descricao: "descricao"
    };

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));

    service.listarElevador(testData.edificio);
    expect(getSpy).toHaveBeenCalled();
  });
});

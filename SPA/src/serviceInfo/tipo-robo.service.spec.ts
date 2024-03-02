import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TipoRobo } from 'src/dataModel/tipoRobo';
import { of } from 'rxjs';

import { TipoRoboService } from './tipo-robo.service';
import { devEnvironment } from 'src/environments/environment.development';

describe('TipoRoboService', () => {
  let service: TipoRoboService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(TipoRoboService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método criarTipoRobo chama o método post do HttpClient', () => {
    const testData: TipoRobo = {idTipoDispositivo: 1, tipoTarefa: ["Tarefa"], marca: "marca", modelo: "modelo"};
    const testDataInput = {tipoTarefa: ["Tarefa"], marca: "marca", modelo: "modelo"}
    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarTipoRobo(testData.tipoTarefa, testData.marca, testData.modelo);
    
    expect(postSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL + 'tipoDispositivo', testDataInput, service.httpOptions);
  });

  it('Método criarTipoRobo com marca vazia não chama o método post do HttpClient', () => {
    const testData: TipoRobo = {idTipoDispositivo: 1, tipoTarefa: ["Tarefa"], marca: "", modelo: "modelo"};
    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarTipoRobo(testData.tipoTarefa, testData.marca, testData.modelo);
    
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarTipoRobo com modelo vazio não chama o método post do HttpClient', () => {
    const testData: TipoRobo = {idTipoDispositivo: 1, tipoTarefa: ["Tarefa"], marca: "marca", modelo: ""};
    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarTipoRobo(testData.tipoTarefa, testData.marca, testData.modelo);
    
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarTipoRobo com tipoTarefa vazio não chama o método post do HttpClient', () => {
    const testData: TipoRobo = {idTipoDispositivo: 1, tipoTarefa: [], marca: "marca", modelo: "modelo"};
    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarTipoRobo(testData.tipoTarefa, testData.marca, testData.modelo);
    
    expect(postSpy).not.toHaveBeenCalled();
  });
});

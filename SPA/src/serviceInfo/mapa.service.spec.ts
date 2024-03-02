import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import CarregarMapa from 'src/dataModel/carregarMapa';
import { of } from 'rxjs';


import { MapaService } from './mapa.service';
import ExportarMapa from 'src/dataModel/exportarMapa';
import { devEnvironment } from 'src/environments/environment.development';

describe('MapaService', () => {
  let service: MapaService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(MapaService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método carregarMapa chama o método patch do HttpClient', () => {
    const testData: CarregarMapa = {
      codigoEdificio: "cod",
      numeroPiso: 1,
    } as CarregarMapa;

    const patchSpy = spyOn(httpClient, 'patch').and.returnValue(of(testData));
    service.carregarMapa(testData);
    expect(patchSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL + 'mapa', testData, service.httpOptions);
  });

  it('Método exportarMapa chama o método get do HttpClient', () => {
    let testData : ExportarMapa = {
      texturaChao: "texturaChao",
      texturaParede: "texturaParede",
      modeloPorta: "modelo",
      modeloElevador: "modelo",
      codigoEdificio: "cod1",
      numeroPiso : 1,
      matriz : [["Norte","Norte"],["Oeste","Oeste"]],
      elevador: {
          xCoord: 1,
          yCoord: 1,
          orientacao: "Norte"
      },
      passagens : [{
          id: 1,
          abcissaA: 1,
          ordenadaA: 2,
          abcissaB: 1,
          ordenadaB: 2,
          orientacao: "Norte"
      }],
      salas : [{
        nome: "test2",
        abcissaA : 1,
        ordenadaA: 1,
        abcissaB: 2,
        ordenadaB: 2,
        abcissaPorta: 1,
        ordenadaPorta: 2,
        orientacaoPorta: "Oeste",
      }],
      posicaoInicialRobo : {
          x: 1,
          y: 2,
      }
    };

    let params = new HttpParams().set('codEdificio', testData.codigoEdificio);
    params = params.append('numPiso', testData.numeroPiso.toString());

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));
    service.exportarMapa(testData.codigoEdificio, testData.numeroPiso);
    expect(getSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL + "mapa", {params: params, headers: service.httpOptions.headers});
  });


  it('Método exportarMapaAtravesDeUmaPassagemEPiso chama o método get do HttpClient', () => {
    let testData : ExportarMapa = {
      texturaChao: "texturaChao",
      texturaParede: "texturaParede",
      modeloPorta: "modelo",
      modeloElevador: "modelo",
      codigoEdificio: "cod1",
      numeroPiso : 1,
      matriz : [["Norte","Norte"],["Oeste","Oeste"]],
      elevador: {
          xCoord: 1,
          yCoord: 1,
          orientacao: "Norte"
      },
      passagens : [{
          id: 1,
          abcissaA: 1,
          ordenadaA: 2,
          abcissaB: 1,
          ordenadaB: 2,
          orientacao: "Norte"
      }],
      salas : [{
        nome: "test2",
        abcissaA : 1,
        ordenadaA: 1,
        abcissaB: 2,
        ordenadaB: 2,
        abcissaPorta: 1,
        ordenadaPorta: 2,
        orientacaoPorta: "Oeste",
      }],
      posicaoInicialRobo : {
          x: 1,
          y: 2,
      }
    };

    let params = new HttpParams().set('idPassagem', testData.passagens[0].id.toString());
    params = params.append('codEd', testData.codigoEdificio);
    params = params.append('numeroPiso', testData.numeroPiso.toString());


    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));
    service.exportarMapaAtravesDeUmaPassagemEPiso(testData.passagens[0].id,testData.codigoEdificio, testData.numeroPiso);
    expect(getSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL + "mapa/atravesDeUmaPassagemEPiso", {params: params, headers: service.httpOptions.headers});
  });
});

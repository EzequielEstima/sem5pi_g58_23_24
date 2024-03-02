import { TestBed } from '@angular/core/testing';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { devEnvironment } from 'src/environments/environment.development';


import { PisoService } from './piso.service';
import { Piso } from 'src/dataModel/piso';

describe('PisoService', () => {
  let service: PisoService;
  const pisoUrl = devEnvironment.MDRI_API_URL + 'piso';  
  let httpClient: HttpClient;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule]
    });
    service = TestBed.inject(PisoService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método criarPiso chama o método POST do HttpClient', () => {
    const testData = {
      codigo: "A",
      numeroPiso: "1" as any,
      descricaoPiso: "descricao"
    };
    testData.numeroPiso = 1;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarPiso(testData.codigo, testData.numeroPiso, testData.descricaoPiso);
    
    expect(postSpy).toHaveBeenCalledWith(pisoUrl,testData,service.httpOptions);
  });

  it('Método criarPiso não chama o método POST do HttpClient sem ter um código de edifício', () => {
    const testData = {
      codigo: "",
      numeroPiso: "1" as any,
      descricaoPiso: "descricao"
    };
    testData.numeroPiso = 1;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarPiso(testData.codigo, testData.numeroPiso, testData.descricaoPiso);
    
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarPiso não chama o método POST do HttpClient sem ter um número de piso', () => {
    const testData = {
      codigo: "A",
      numeroPiso: "",
      descricaoPiso: "descricao"
    };

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarPiso(testData.codigo, testData.numeroPiso, testData.descricaoPiso);
    
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método editarPiso chama o método PUT do HttpClient', () => {
    const testInsertData = {
      codigoEdificio: "A",
      numeroPiso: "1",
      novoNumeroPiso: "2",
      descricaoPiso: "descricao"
    };
    const testGetData = {
      codigoEdificio: "A",
      numeroPiso: 1,
      novoNumeroPiso: 2,
      descricaoPiso: "descricao"
    };

    const testDataExpected = {
      codigo: "A",
      numeroPiso: 2,
      descricaoPiso: "descricao"
    } as unknown as Piso;

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testDataExpected));

    service.editarPiso(testInsertData.codigoEdificio, testInsertData.numeroPiso, testInsertData.novoNumeroPiso, testInsertData.descricaoPiso);
    
    expect(putSpy).toHaveBeenCalledWith(pisoUrl,testGetData,service.httpOptions);
  });

  it('Método editarPiso não chama o método PUT do HttpClient caso o código do edificio seja vazio', () => {
    const testData = {
      codigoEdificio: "",
      numeroPiso: "1",
      novoNumeroPiso: "2",
      descricaoPiso: "descricao"
    };
    

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarPiso(testData.codigoEdificio, testData.numeroPiso, testData.novoNumeroPiso, testData.descricaoPiso);
    
    expect(putSpy).not.toHaveBeenCalled();
  });

  it('Método editarPiso não chama o método PUT do HttpClient caso o numero do piso seja vazio', () => {
    const testData = {
      codigoEdificio: "A",
      numeroPiso: "",
      novoNumeroPiso: "2",
      descricaoPiso: "descricao"
    };
    

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarPiso(testData.codigoEdificio, testData.numeroPiso, testData.novoNumeroPiso, testData.descricaoPiso);
    
    expect(putSpy).not.toHaveBeenCalled();
  });

  it('Método listarNumeroPiso chama o método get do HttpClient', () => {
    const testInsertData = {
      codigo: "A",
    };
    const testData: number[] = [1, 1];

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));
  

    service.listarNumeroPisos(testInsertData.codigo);
    
    expect(getSpy).toHaveBeenCalled();
  });

  it('Método listarPisos chama o método get do HttpClient', () => {
    const testInsertData = {
      codigo: "A",
    };
    const testData: number[] = [1, 1];

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));
  

    service.listarPisos(testInsertData.codigo);
    
    expect(getSpy).toHaveBeenCalled();

  });


});

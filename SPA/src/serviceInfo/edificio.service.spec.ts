import { devEnvironment } from 'src/environments/environment.development';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EdificioService } from './edificio.service';
import { HttpClient } from '@angular/common/http';
import { Edificio } from 'src/dataModel/edificio';
import { of } from 'rxjs';

describe('EdificioService', () => {
  let service: EdificioService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(EdificioService);
    httpClient = TestBed.inject(HttpClient);
  });
  

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método criarEdificio chama o método post do HttpClient', () => {
    const testData: Edificio = {codigo: "cod", nome: "nome", descricao: "descricao",dimensaoX: 1, dimensaoY: 1};

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarEdificio(testData.codigo, String(testData.dimensaoX), String(testData.dimensaoY),testData.nome, testData.descricao);
    
    expect(postSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL +'edificio', testData, service.httpOptions);
  });

  it('Método criarEdificio com código vazio não chama o método post do HttpClient', () => {
    const testData: Edificio = {codigo: "", nome: "nome", descricao: "descricao",dimensaoX: 1, dimensaoY: 1};

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(testData));

    service.criarEdificio(testData.codigo, String(testData.dimensaoX), String(testData.dimensaoY),testData.nome, testData.descricao);
    
    expect(postSpy).not.toHaveBeenCalled();
  });
  it ('Método listarEdificio chama o método get do HttpClient', () => {
    const testData: Edificio = {codigo: "cod", nome: "nome", descricao: "descricao",dimensaoX: 1, dimensaoY: 1};

    const edificioUrl: string = (service as any).edificioUrl; // service as any dá o valor da variável privada
                                                              //colocando a diretamente ao url não funciona

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));

    service.listarEdificios();
    expect(getSpy).toHaveBeenCalledWith(edificioUrl, service.httpOptions);
  });

  it ('Método editarEdifício chama o método put do HttpClient', () => {
    const testData = {codigo: "cod", nome: "nome", descricao: "descricao"};

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarEdificio(testData.codigo, testData.nome, testData.descricao);
    expect(putSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL + 'edificio', testData, service.httpOptions);
  });

  it ('Método editarEdificio com código vazio não chama o método put do HttpClient', () => {
    const testData = {codigo: "", nome: "nome", descricao: "descricao"};

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarEdificio(testData.codigo, testData.nome, testData.descricao);
    expect(putSpy).not.toHaveBeenCalled();
  });

  it ('Método editarEdificio com nome vazio chama o método put do HttpClient, sem o nome', () => {
    const testDataInput = {codigo: "cod", nome: "", descricao: "descricao"};
    const testData = {codigo: "cod", descricao: "descricao"};
    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarEdificio(testDataInput.codigo, testDataInput.nome, testDataInput.descricao);
    expect(putSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL + 'edificio', testData, service.httpOptions);
  });

  it ('Método editarEdificio com descricao vazia chama o método put do HttpClient, sem a descircao', () => {
    const testDataInput = {codigo: "cod", nome: "nome", descricao: ""};
    const testData = {codigo: "cod", nome: "nome"};

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarEdificio(testDataInput.codigo, testDataInput.nome, testDataInput.descricao);
    expect(putSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL +'edificio', testData, service.httpOptions);
  });

  it ('Método editarEdificio com nome e descricao vazios chama o método put do HttpClient, sem o nome e a descricao', () => {
    const testDataInput = {codigo: "cod", nome: "", descricao: ""};
    const testData = {codigo: "cod"};

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(testData));

    service.editarEdificio(testDataInput.codigo, testDataInput.nome, testDataInput.descricao);
    expect(putSpy).not.toHaveBeenCalled();
  });

  it('Método listarCodEdificios chama o método get do HttpClient', () => {
    const testData: string[] = ["cod1", "cod2"];

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of(testData));

    service.listarCodEdificios();
    expect(getSpy).toHaveBeenCalledWith(devEnvironment.MDRI_API_URL + 'edificio', service.httpOptions);
  });
});

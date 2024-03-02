import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { devEnvironment } from 'src/environments/environment.development';

import { TarefaService } from './tarefa.service';
import Tarefa from 'src/dataModel/tarefa';
import AlterarEstadoDaTarefa from 'src/dataModel/alterarEstadoDaTarefa';
import { CriarVigilancia } from 'src/dataModel/criarVigilancia';
import { CriarPickUpDelivery } from 'src/dataModel/criarPickUPDelivery';

describe('TarefaService', () => {
  let service: TarefaService;
  const tarefaUrl = devEnvironment.MDTarefas_API_URL + 'Tarefa';
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TarefaService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método alterarEstadoTarefa chama o método PUT do HttpClient quando o estado é aceite', () => {

    const testDataInsert = {
      Id: "1",
      CodigoRobo: "codigoRobo",
      Estado: "Aceite",
    } as unknown as AlterarEstadoDaTarefa;

    const tarefaMock = {
      codConfirmacao: null,
      codDispositivo: "codigoRobo",
      codEdificio: "A",
      descricaoEntrega: null,
      emailRequisitor: "emailPlaceholder",
      estadoString: "Aceite",
      id: "1",
      nomeVigilancia: "Cavaco Silva",
      numeroPiso: 1,
      numeroVigilancia: "987654321",
      percursoString: "percursoVigilanciaPlaceholder",
      tipoTarefa: "Vigilancia"
    } as unknown as Tarefa;

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(tarefaMock));

    service.alterarEstadoTarefa(testDataInsert.Id, testDataInsert.Estado, testDataInsert.CodigoRobo);

    expect(putSpy).toHaveBeenCalledWith(tarefaUrl, testDataInsert, service.httpOptions);
  });


  it('Método alterarEstadoTarefa chama o método PUT do HttpClient quando o estado é rejeitada', () => {

    const testDataInsert = {
      Id: "1",
      Estado: "Rejeitada",
    } as unknown as AlterarEstadoDaTarefa;

    const tarefaMock = {
      codConfirmacao: null,
      codDispositivo: "",
      codEdificio: "A",
      descricaoEntrega: null,
      emailRequisitor: "emailPlaceholder",
      estadoString: "Rejeitada",
      id: "1",
      nomeVigilancia: "Cavaco Silva",
      numeroPiso: 1,
      numeroVigilancia: "987654321",
      percursoString: "percursoVigilanciaPlaceholder",
      tipoTarefa: "Vigilancia"
    } as unknown as Tarefa;

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(tarefaMock));

    service.alterarEstadoTarefa(testDataInsert.Id, testDataInsert.Estado, testDataInsert.CodigoRobo);

    expect(putSpy).toHaveBeenCalledWith(tarefaUrl, testDataInsert, service.httpOptions);
  });


  it('Método alterarEstadoTarefa não chama o método PUT do HttpClient quando o id esta vazio', () => {

    const testDataInsert = {
      Id: "",
      CodigoRobo: "codigoRobo",
      Estado: "Aceite",
    } as unknown as AlterarEstadoDaTarefa;

    const tarefaMock = {
      codConfirmacao: null,
      codDispositivo: "codigoRobo",
      codEdificio: "A",
      descricaoEntrega: null,
      emailRequisitor: "emailPlaceholder",
      estadoString: "Aceite",
      id: "1",
      nomeVigilancia: "Cavaco Silva",
      numeroPiso: 1,
      numeroVigilancia: "987654321",
      percursoString: "percursoVigilanciaPlaceholder",
      tipoTarefa: "Vigilancia"
    } as unknown as Tarefa;

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(tarefaMock));

    service.alterarEstadoTarefa(testDataInsert.Id, testDataInsert.Estado, testDataInsert.CodigoRobo);

    expect(putSpy).not.toHaveBeenCalled();
  });

  it('Método alterarEstadoTarefa não chama o método PUT do HttpClient quando o estado esta vazio', () => {

    const testDataInsert = {
      Id: "1",
      CodigoRobo: "codigoRobo",
      Estado: "",
    } as unknown as AlterarEstadoDaTarefa;

    const tarefaMock = {
      codConfirmacao: null,
      codDispositivo: "codigoRobo",
      codEdificio: "A",
      descricaoEntrega: null,
      emailRequisitor: "emailPlaceholder",
      estadoString: "Aceite",
      id: "1",
      nomeVigilancia: "Cavaco Silva",
      numeroPiso: 1,
      numeroVigilancia: "987654321",
      percursoString: "percursoVigilanciaPlaceholder",
      tipoTarefa: "Vigilancia"
    } as unknown as Tarefa;

    const putSpy = spyOn(httpClient, 'put').and.returnValue(of(tarefaMock));

    service.alterarEstadoTarefa(testDataInsert.Id, testDataInsert.Estado, testDataInsert.CodigoRobo);

    expect(putSpy).not.toHaveBeenCalled();
  });

  it('Método criarTarefaVigilancia chama o método POST do HttpClient quando os dados são válidos', () => {

    const testDataInsert = {
      tipoTarefa: "Vigilancia",
      nomeVigilancia: "Nome1",
      numeroVigilancia: "987654321",
      codEdificio: "A",
      numeroPiso: 1
    } as CriarVigilancia;

    const returnPost = {
      tipoTarefa: "Vigilancia",
      id: "1",
      percursoString: "percursoVigilanciaPlaceholder",
      estadoString: "Pendente",
      emailRequisitor: "emailPlaceholder",
      codDispositivo: "",
      odConfirmacao: null,
      descricaoEntrega: null,
      nomePickUp: null,
      numeroPickUp: null,
      nomeDelivery: null,
      numeroDelivery: null,
      salaInicial: null,
      salaFinal: null,
      nomeVigilancia: "Nome1",
      numeroVigilancia: "987654321",
      codEdificio: "A",
      numeroPiso: 1
    } as unknown as Tarefa;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnPost));

    service.criarTarefaVigilancia(testDataInsert.nomeVigilancia, testDataInsert.numeroVigilancia, testDataInsert.codEdificio, testDataInsert.numeroPiso);

    expect(postSpy).toHaveBeenCalledWith(tarefaUrl, testDataInsert, service.httpOptions);
  });

  it('Método criarTarefaVigilancia não chama o método POST do HttpClient quando o nome é vazio', () => {

    const testDataInsert = {
      tipoTarefa: "Vigilancia",
      nomeVigilancia: "",
      numeroVigilancia: "987654321",
      codEdificio: "A",
      numeroPiso: 1
    } as CriarVigilancia;

    const returnPost = {
      tipoTarefa: "Vigilancia",
      id: "1",
      percursoString: "percursoVigilanciaPlaceholder",
      estadoString: "Pendente",
      emailRequisitor: "emailPlaceholder",
      codDispositivo: "",
      odConfirmacao: null,
      descricaoEntrega: null,
      nomePickUp: null,
      numeroPickUp: null,
      nomeDelivery: null,
      numeroDelivery: null,
      salaInicial: null,
      salaFinal: null,
      nomeVigilancia: "Nome1",
      numeroVigilancia: "987654321",
      codEdificio: "A",
      numeroPiso: 1
    } as unknown as Tarefa;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnPost));

    service.criarTarefaVigilancia(testDataInsert.nomeVigilancia, testDataInsert.numeroVigilancia, testDataInsert.codEdificio, testDataInsert.numeroPiso);

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarTarefaVigilancia não chama o método POST do HttpClient quando o nome é vazio', () => {

    const testDataInsert = {
      tipoTarefa: "Vigilancia",
      nomeVigilancia: "Nome1",
      numeroVigilancia: "",
      codEdificio: "A",
      numeroPiso: 1
    } as CriarVigilancia;

    const returnPost = {
      tipoTarefa: "Vigilancia",
      id: "1",
      percursoString: "percursoVigilanciaPlaceholder",
      estadoString: "Pendente",
      emailRequisitor: "emailPlaceholder",
      codDispositivo: "",
      odConfirmacao: null,
      descricaoEntrega: null,
      nomePickUp: null,
      numeroPickUp: null,
      nomeDelivery: null,
      numeroDelivery: null,
      salaInicial: null,
      salaFinal: null,
      nomeVigilancia: "Nome1",
      numeroVigilancia: "987654321",
      codEdificio: "A",
      numeroPiso: 1
    } as unknown as Tarefa;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnPost));

    service.criarTarefaVigilancia(testDataInsert.nomeVigilancia, testDataInsert.numeroVigilancia, testDataInsert.codEdificio, testDataInsert.numeroPiso);

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarTarefaPickUpDelivery chama o método POST do HttpClient quando os dados são válidos', () => {

    const testDataInsert = {
      tipoTarefa: "PickUpDelivery",
      codConfirmacao: "1234",
      descricaoEntrega: "DESC",
      nomePickUp: "ABC",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "123456789",
      salaInicial: "A203",
      salaFinal: "A202"
    } as CriarPickUpDelivery;

    const returnPost = {
      tipoTarefa: "PickUpDelivery",
      id: "1",
      percursoString: "percursoVigilanciaPlaceholder",
      estadoString: "Pendente",
      emailRequisitor: "emailPlaceholder",
      codDispositivo: "",
      codConfirmacao: "1234",
      descricaoEntrega: "Desc",
      nomePickUp: "ABC",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "123456789",
      salaInicial: "A203",
      salaFinal: "A202",
      nomeVigilancia: null,
      numeroVigilancia: null,
      codEdificio: null,
      numeroPiso: null
    } as unknown as Tarefa;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnPost));

    service.criarTarefaPickUpDelivery(testDataInsert.codConfirmacao, testDataInsert.descricaoEntrega, testDataInsert.nomePickUp, testDataInsert.numeroPickUp, testDataInsert.nomeDelivery, testDataInsert.numeroDelivery, testDataInsert.salaInicial, testDataInsert.salaFinal);

    expect(postSpy).toHaveBeenCalledWith(tarefaUrl, testDataInsert, service.httpOptions);
  });

  it('Método criarTarefaPickUpDelivery não chama o método POST do HttpClient quando o codigo de confimação é vazio', () => {

    const testDataInsert = {
      tipoTarefa: "PICKupDELIVERY",
      codConfirmacao: "",
      descricaoEntrega: "DESC",
      nomePickUp: "ABC",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "123456789",
      salaInicial: "A203",
      salaFinal: "A202"
    } as CriarPickUpDelivery;

    const returnPost = {
      tipoTarefa: "PickUpDelivery",
      id: "1",
      percursoString: "percursoVigilanciaPlaceholder",
      estadoString: "Pendente",
      emailRequisitor: "emailPlaceholder",
      codDispositivo: "",
      codConfirmacao: "",
      descricaoEntrega: "Desc",
      nomePickUp: "ABC",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "123456789",
      salaInicial: "A203",
      salaFinal: "A202",
      nomeVigilancia: null,
      numeroVigilancia: null,
      codEdificio: null,
      numeroPiso: null
    } as unknown as Tarefa;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnPost));

    service.criarTarefaPickUpDelivery(testDataInsert.codConfirmacao, testDataInsert.descricaoEntrega, testDataInsert.nomePickUp, testDataInsert.numeroPickUp, testDataInsert.nomeDelivery, testDataInsert.numeroDelivery, testDataInsert.salaInicial, testDataInsert.salaFinal);

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarTarefaPickUpDelivery não chama o método POST do HttpClient quando a descrição é vazia', () => {

    const testDataInsert = {
      tipoTarefa: "PICKupDELIVERY",
      codConfirmacao: "1234",
      descricaoEntrega: "",
      nomePickUp: "ABC",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "123456789",
      salaInicial: "A203",
      salaFinal: "A202"
    } as CriarPickUpDelivery;

    const returnPost = {
      tipoTarefa: "PickUpDelivery",
      id: "1",
      percursoString: "percursoVigilanciaPlaceholder",
      estadoString: "Pendente",
      emailRequisitor: "emailPlaceholder",
      codDispositivo: "",
      codConfirmacao: "1234",
      descricaoEntrega: "",
      nomePickUp: "ABC",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "123456789",
      salaInicial: "A203",
      salaFinal: "A202",
      nomeVigilancia: null,
      numeroVigilancia: null,
      codEdificio: null,
      numeroPiso: null
    } as unknown as Tarefa;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnPost));

    service.criarTarefaPickUpDelivery(testDataInsert.codConfirmacao, testDataInsert.descricaoEntrega, testDataInsert.nomePickUp, testDataInsert.numeroPickUp, testDataInsert.nomeDelivery, testDataInsert.numeroDelivery, testDataInsert.salaInicial, testDataInsert.salaFinal);

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarTarefaPickUpDelivery chama o método POST do HttpClient quando o nome é vazio', () => {

    const testDataInsert = {
      tipoTarefa: "PICKupDELIVERY",
      codConfirmacao: "1234",
      descricaoEntrega: "DESC",
      nomePickUp: "",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "123456789",
      salaInicial: "A203",
      salaFinal: "A202"
    } as CriarPickUpDelivery;

    const returnPost = {
      tipoTarefa: "PickUpDelivery",
      id: "1",
      percursoString: "percursoVigilanciaPlaceholder",
      estadoString: "Pendente",
      emailRequisitor: "emailPlaceholder",
      codDispositivo: "",
      codConfirmacao: "1234",
      descricaoEntrega: "Desc",
      nomePickUp: "",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "123456789",
      salaInicial: "A203",
      salaFinal: "A202",
      nomeVigilancia: null,
      numeroVigilancia: null,
      codEdificio: null,
      numeroPiso: null
    } as unknown as Tarefa;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnPost));

    service.criarTarefaPickUpDelivery(testDataInsert.codConfirmacao, testDataInsert.descricaoEntrega, testDataInsert.nomePickUp, testDataInsert.numeroPickUp, testDataInsert.nomeDelivery, testDataInsert.numeroDelivery, testDataInsert.salaInicial, testDataInsert.salaFinal);

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Método criarTarefaPickUpDelivery chama o método POST do HttpClient quando o número é vazio', () => {

    const testDataInsert = {
      tipoTarefa: "PickUpDelivery",
      codConfirmacao: "1234",
      descricaoEntrega: "DESC",
      nomePickUp: "ABC",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "",
      salaInicial: "A203",
      salaFinal: "A202"
    } as CriarPickUpDelivery;

    const returnPost = {
      tipoTarefa: "PickUpDelivery",
      id: "1",
      percursoString: "percursoVigilanciaPlaceholder",
      estadoString: "Pendente",
      emailRequisitor: "emailPlaceholder",
      codDispositivo: "",
      codConfirmacao: "1234",
      descricaoEntrega: "Desc",
      nomePickUp: "ABC",
      numeroPickUp: "123456789",
      nomeDelivery: "ABC",
      numeroDelivery: "",
      salaInicial: "A203",
      salaFinal: "A202",
      nomeVigilancia: null,
      numeroVigilancia: null,
      codEdificio: null,
      numeroPiso: null
    } as unknown as Tarefa;

    const postSpy = spyOn(httpClient, 'post').and.returnValue(of(returnPost));

    service.criarTarefaPickUpDelivery(testDataInsert.codConfirmacao, testDataInsert.descricaoEntrega, testDataInsert.nomePickUp, testDataInsert.numeroPickUp, testDataInsert.nomeDelivery, testDataInsert.numeroDelivery, testDataInsert.salaInicial, testDataInsert.salaFinal);

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Metodo obterTarefa chama o método GET do HttpClient quando os dados são válidos', () => {
    const testDataInsert = {
      criterio: "estado",
      valor: "aceite",
    }

    const fakeResponse = of([/* dados simulados de resposta */]);

    const getSpy = spyOn(httpClient, 'get').and.returnValue(fakeResponse);

    service.obterTarefa(testDataInsert.criterio, testDataInsert.valor);

    const params = new HttpParams()
      .set('criterio', testDataInsert.criterio)
      .set('valor', testDataInsert.valor);

    expect(getSpy).toHaveBeenCalledWith(
      tarefaUrl + "/obterTarefasPorCriterio",
      { params }
    );
  });

  it 
});

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { devEnvironment } from 'src/environments/environment.development';
import { MessageService } from './message.service';
import AlterarEstadoDaTarefa from 'src/dataModel/alterarEstadoDaTarefa';
import Tarefa from 'src/dataModel/tarefa';
import { CriarVigilancia } from 'src/dataModel/criarVigilancia';
import { CriarPickUpDelivery } from 'src/dataModel/criarPickUPDelivery';
import { forEach } from 'lodash';
import { ReturnPlanearTarefas } from 'src/dataModel/returnPlanearTarefas';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private tarefaUrl = devEnvironment.MDTarefas_API_URL + 'Tarefa';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  public criarTarefaPickUpDelivery(codConf: string, desc: string, nomePickup: string, numeroPickup: string, nomeDelivery: string, numeroDelivery: string, salaInicial: string, salaFinal: string): void{

    if (this.validarDadosPickUpDelivery(codConf, desc, nomePickup, numeroPickup, nomeDelivery, numeroDelivery, salaInicial, salaFinal)){
      let tarefaDataModel = {
        tipoTarefa: "PickUpDelivery",
        codConfirmacao: codConf,
        descricaoEntrega: desc,
        nomePickUp: nomePickup,
        numeroPickUp: numeroPickup,
        nomeDelivery: nomeDelivery,
        numeroDelivery: numeroDelivery,
        salaInicial: salaInicial,
        salaFinal: salaFinal
      } as CriarPickUpDelivery;
  
      
      this.http.post<Tarefa>(this.tarefaUrl, tarefaDataModel, this.httpOptions)
      .pipe(catchError(this.handleError<Tarefa>('Criar tarefa de pickUp&Delivery')))
      .subscribe({
          next: data=>{ 
            if(data != null && data != undefined){
              this.log(`Tarefa criada com sucesso`);
            }
          }
      });
      
    }
  }

  private validarDadosPickUpDelivery(codConf: string, desc: string, 
                                      nomePickup: string, numeroPickup: string, 
                                      nomeDelivery: string, numeroDelivery: string, 
                                      salaInicial: string, salaFinal: string): boolean{
    if(codConf == null || codConf == undefined || codConf == ""){
      this.log(`ERRO: O código de confirmação é um campo obrigatório`);
      return false;
    }
    if(desc == null || desc == undefined || desc == ""){
      this.log(`ERRO: A descrição da entrega é um campo obrigatório`);
      return false;
    }
    if(nomePickup == null || nomePickup == undefined || nomePickup == ""){
      this.log(`ERRO: O nome do contacto de pickup é um campo obrigatório`);
      return false;
    }
    if(numeroPickup == null || numeroPickup == undefined || numeroPickup == ""){
      this.log(`ERRO: O numero do contacto de pickup é um campo obrigatório`);
      return false;
    }
    if(nomeDelivery == null || nomeDelivery == undefined || nomeDelivery == ""){
      this.log(`ERRO: O nome do contacto de delivery é um campo obrigatório`);
      return false;
    }
    if(numeroDelivery == null || numeroDelivery == undefined || numeroDelivery == ""){
      this.log(`ERRO: O numero do contacto de delivery é um campo obrigatório`);
      return false;
    }
    if(salaInicial == null || salaInicial == undefined || salaInicial == ""){
      this.log(`ERRO: A sala inicial é um campo obrigatório`);
      return false;
    }
    if(salaFinal == null || salaFinal == undefined || salaFinal == ""){
      this.log(`ERRO: A sala final é um campo obrigatório`);
      return false;
    }
    return true;
  }

  public criarTarefaVigilancia(nomeVigilancia: string, numeroVigilancia: string, codigoEd: string, numeroPiso: number): void{

    if (this.validarDadosVigilancia(nomeVigilancia, numeroVigilancia, codigoEd, numeroPiso)){
      let tarefaDataModel = {
        tipoTarefa: "Vigilancia",
        nomeVigilancia: nomeVigilancia,
        numeroVigilancia: numeroVigilancia,
        codEdificio: codigoEd,
        numeroPiso: numeroPiso
      } as CriarVigilancia;
  
      
      this.http.post<Tarefa>(this.tarefaUrl, tarefaDataModel, this.httpOptions)
      .pipe(catchError(this.handleError<Tarefa>('Criar tarefa de vigilância')))
      .subscribe({
          next: data=>{
            if(data != null && data != undefined){
              this.log(`Tarefa criada com sucesso`);
            }
          }
      });
      
    }
  }

  private validarDadosVigilancia(nomeVigilancia: string, numeroVigilancia: string, codigoEd: string, numeroPiso: number): boolean{
    if(nomeVigilancia == null || nomeVigilancia == undefined || nomeVigilancia == ""){
      this.log(`ERRO: O nome do contacto de vigilância é um campo obrigatório`);
      return false;
    }
    if(numeroVigilancia == null || numeroVigilancia == undefined || numeroVigilancia == ""){
      this.log(`ERRO: O numero do contacto de vigilância é um campo obrigatório`);
      return false;
    }
    if(codigoEd == null || codigoEd == undefined || codigoEd == ""){
      this.log(`ERRO: O código do edifício é um campo obrigatório`);
      return false;
    }
    if(numeroPiso == null || numeroPiso == undefined){
      this.log(`ERRO: O número do piso é um campo obrigatório`);
      return false;
    }
    return true;
  }

  alterarEstadoTarefa(idTarefa: string, estado: string, codigoRobo: string): void{
    if(idTarefa == null || idTarefa == undefined || idTarefa == ""){
      this.log(`ERRO: O id da tarefa tem de ser válido`);
      return;
    }
    if(estado == null || estado == undefined || estado == ""){
      this.log(`ERRO: O estado da tarefa tem de ser valido`);
      return;
    }

    let alterarEstadoDaTarefa;
    if(codigoRobo == null || codigoRobo == undefined || codigoRobo == ""){
      alterarEstadoDaTarefa = {
        Id: idTarefa,
        Estado: estado,
      } as AlterarEstadoDaTarefa;
    }else{
      alterarEstadoDaTarefa = {
        Id: idTarefa,
        CodigoRobo: codigoRobo,
        Estado: estado,
      } as AlterarEstadoDaTarefa;
    }
    
    this.http.put<Tarefa>(this.tarefaUrl, alterarEstadoDaTarefa, this.httpOptions)
    .pipe(catchError(this.handleError<Tarefa>('Adicionar sala ao piso')))
    .subscribe({
        next: data=>{ 
          let estadoTarefa = data.estadoString;
          let codigo = data.codDispositivo;
          let id = data.id;
          
          if(estadoTarefa == "Aceite"){
            this.log(`Tarefa ${id} foi aceite e irá ser feita pelo robo ${codigo}`);
          }else if(estadoTarefa == "Rejeitada"){
            this.log(`Tarefa ${id} foi rejeitada`);
          }
      }
    });;
  }

  obterTarefa(criterio: string| null, valor: string | null) : Observable<Tarefa[] | null>{
      if (criterio == null || criterio == undefined || criterio == ""){
        this.log(`ERRO: O critério de pesquisa é obrigatório`);
        return of(null);
      }
      if (valor == null || valor == undefined || valor == ""){
        this.log(`ERRO: O valor de pesquisa é obrigatório`);
        return of(null);
      }
      let params = new HttpParams().set('criterio', criterio).set('valor', valor);
      console.log(criterio);
      console.log(valor);

      return this.http.get<Tarefa[]>(this.tarefaUrl + "/obterTarefasPorCriterio", { params: params })
      .pipe(
        catchError(this.handleError<Tarefa[]>('Obter tarefa')),
        tap(data => {
          if (data) {
            this.log(`Tarefas obtidas com sucesso:`);
          } else {
            this.log(`Não foram encontradas tarefas`);
          }
        })
      );
  }

  public getTarefasPendentes(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.tarefaUrl + "/tarefasPendentes", this.httpOptions)
      .pipe(
        catchError(this.handleError<Tarefa[]>('getTarefasPendentes'))
      );
  }

  public deleteTarefa(id: string ){
    if(id == null || id == undefined || id == ""){
      this.log(`ERRO: O id da tarefa é obrigatório`);
      return;
    }

    let params = new HttpParams().set('id', id);
    
    this.http.delete(this.tarefaUrl, { params: params, responseType: 'text' })
    .pipe(catchError(this.handleError('Apagar tarefa')))
    .subscribe({
        next: data=>{
        if(data != null && data != undefined){
          this.log(`Tarefa foi apagada com sucesso`);
        }
      }
    });
    

  }

  public obterPercursoTarefa (idTarefa: string): Observable<string|null>{
    if(idTarefa == null || idTarefa == undefined || idTarefa == ""){
      this.log(`ERRO: O id da tarefa é obrigatório`);
      return of(null);
    }

    let params = new HttpParams().set('idTarefa', idTarefa);
    
    return this.http.get<string>(this.tarefaUrl + "/obterPercursoTarefa", { params: params, responseType: 'text' as 'json'})
    .pipe(
      catchError(this.handleError<string>('Obter percurso da tarefa'))
    );
  }

  planearTarefas(algoritmo: number) : Observable<ReturnPlanearTarefas[] | null>{
    if (algoritmo != 0 && algoritmo != 1){
      this.log(`ERRO: O algoritmo é obrigatório`);
      return of(null);
    }
   
    let params = new HttpParams().set('algoritmo', algoritmo);

    return this.http.get<ReturnPlanearTarefas[]>(this.tarefaUrl + "/carregarTarefasNoPlaneamento", { params: params })
    .pipe(
      catchError(this.handleError<ReturnPlanearTarefas[]>('Planear Tarefa'))
    );
}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      
      if(error.status === 440){
        this.log("Erro: Sessão expirada.");
        return of(result as T);
      }else if(error.status === 401){
        this.log("Erro: Não está autenticado.");
        return of(result as T);
      }else if(error.status === 403){
        this.log("Erro: Não tem permissões para aceder a este conteúdo.");
        return of(result as T);
      }else{
        console.log("HELLO");
        this.log(`${operation} falhou: ${error.error}`);
      }

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`${message}`);
  }
}

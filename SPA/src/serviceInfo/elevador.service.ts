import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Elevador } from 'src/dataModel/elevador';
import { devEnvironment } from 'src/environments/environment.development';
import { ListarElevador } from 'src/dataModel/listarElevador';

@Injectable({
  providedIn: 'root'
})
export class ElevadorService {

  private elevadorUrl = devEnvironment.MDRI_API_URL + 'elevador';
  private listarElevadorUrl = this.elevadorUrl + '/elevadoresPorEdificio';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }

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

  public criarElevador(codigoEd: string, pisosServidos: number[], marca: string,modelo:string, numSerie:string, descricao: string): void{
    let elevador: Elevador = {} as Elevador;
    if (this.validarDadosCriacao(codigoEd, pisosServidos)){
      elevador.edificio = codigoEd;
      elevador.pisosServidos = pisosServidos;
      if (marca != null && marca != undefined && marca != ""){
        elevador.marca = marca;
      }
      if (modelo != null && modelo != undefined && modelo != ""){
        elevador.modelo = modelo;
      }
      if (numSerie != null && numSerie != undefined && numSerie != ""){
        elevador.numeroSerie = numSerie;
      }
      if (descricao != null && descricao != undefined && descricao != ""){
        elevador.descricao = descricao;
      }
      this.postElevador(elevador);
    }
  }
  
  private validarDadosCriacao(codigoEd: string, pisosServidos: number[]) : boolean {
    if(codigoEd === null || codigoEd === undefined || codigoEd === ""){
      this.log("Código de edifício não pode ser vazio!");
      return false;
    }
    
    if(pisosServidos === null || pisosServidos === undefined || pisosServidos.length < 2 ){
      this.log("Tem que selecionar pelo menos 2 pisos!");
      return false;
    }
    
    return true;
  }
  
  private postElevador(elevador: Elevador) {
    this.http.post<Elevador>(this.elevadorUrl, elevador, this.httpOptions)
    .pipe(catchError(this.handleError<Elevador>('Criar Elevador')))
    .subscribe({
        next: data =>{
          this.log("Elevador no edifício "+ data.edificio +" criado com sucesso!");
        }
    });
  }

  public editarElevador(codigoEd: string, pisosServidos: number[], marca: string,modelo:string, numSerie:string, descricao: string): void{
    let elevador: Elevador = {} as Elevador;
    if (this.validarDadosEdicao(codigoEd, pisosServidos)){

      elevador.edificio = codigoEd;

      if (pisosServidos.length >= 2){
        elevador.pisosServidos = pisosServidos;
      }
      
      if (marca != null && marca != undefined && marca != ""){
        elevador.marca = marca;
      }
      if (modelo != null && modelo != undefined && modelo != ""){
        elevador.modelo = modelo;
      }
      if (numSerie != null && numSerie != undefined && numSerie != ""){
        elevador.numeroSerie = numSerie;
      }
      if (descricao != null && descricao != undefined && descricao != ""){
        elevador.descricao = descricao;
      }
      this.putElevador(elevador);
    }
  }
  
  private validarDadosEdicao(codigoEd: string, pisosServidos: number[]) : boolean {
    if(codigoEd === null || codigoEd === undefined || codigoEd === ""){
      this.log("Código de edifício não pode ser vazio!");
      return false;
    }
    // pisosServidos.length !== 1 porque o array pode vir vazio (pisosServidos.length === 0 não é para ser alterado) 
    // ou com os novos pisos (pisosServidos.length >=2)
    if(pisosServidos === null || pisosServidos === undefined || pisosServidos.length === 1 ){
      this.log("Tem que selecionar pelo menos 2 pisos!");
      return false;
    }
    
    return true;
  }
  
  private putElevador(elevador: Elevador) {
    this.http.put<Elevador>(this.elevadorUrl, elevador, this.httpOptions)
    .pipe(catchError(this.handleError<Elevador>('Editar Elevador')))
    .subscribe({
        next: data =>{
          this.log("Elevador no edifício "+ data.edificio +" editado com sucesso!");
        }
    });
  }

  public listarElevador(codigoEd: string): Observable<ListarElevador>{
    let params = new HttpParams().set('edificio', codigoEd);

    return this.http.get<ListarElevador>(this.listarElevadorUrl, { params: params, headers: this.httpOptions.headers })
    .pipe(
      catchError(this.handleError<ListarElevador>('Listar Elevador'))
    );
  }
}

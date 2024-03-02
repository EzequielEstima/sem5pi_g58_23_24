import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Piso } from '../dataModel/piso';
import { MessageService } from './message.service';
import { EditarPiso } from 'src/dataModel/editarPiso';
import { EdificioService } from './edificio.service';
import { devEnvironment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class PisoService {

  
  private pisoUrl = devEnvironment.MDRI_API_URL + 'piso';
  private pisoMapaUrl = devEnvironment.MDRI_API_URL + 'piso/pisosComMapa';
  private pisoServidoPorElevadorUrl = devEnvironment.MDRI_API_URL + 'piso/pisosServidosPorElevador';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }


  criarPiso(codigo: string,
              numeroPiso: string,
              descricaoPiso: string): void{
      
    let piso: Piso;
    if(this.validateData(codigo, numeroPiso)){
    if(descricaoPiso==null || descricaoPiso=="" || descricaoPiso== undefined){
      piso = {codigo: codigo, numeroPiso: Number(numeroPiso)} as Piso;
    }else{
      piso = {codigo: codigo, numeroPiso:  Number(numeroPiso), descricaoPiso: descricaoPiso} as Piso;
    }
      this.addPiso(piso);
    }
      
  }
  

  private addPiso(piso: Piso): void{
    let codigo: string;
    let numeroPiso: number;
    let descricaoPiso: string;
    
    this.http.post<Piso>(this.pisoUrl, piso, this.httpOptions)
    .pipe(catchError(this.handleError<Piso>('Criar Piso')))
    .subscribe({
        next: data=>{codigo=data.codigo;
          numeroPiso=data.numeroPiso;
          if(data.descricaoPiso==null)
            this.log("Piso com código: "+codigo+", número Piso: "+numeroPiso+" criado com sucesso!");
          else{
          descricaoPiso=data.descricaoPiso;
          this.log("Piso com código: "+codigo+", número Piso: "+numeroPiso+", descrição: "+descricaoPiso+" criado com sucesso!");
          }
          
      }
    });
  }

  editarPiso(codigo: string,
              numeroPiso: string,
              novoNumeroPiso: string,
              descricaoPiso: string): void{
              
  if(this.validateData(codigo, numeroPiso)){
    let piso: EditarPiso = {codigoEdificio: codigo, numeroPiso: Number(numeroPiso)} as EditarPiso;
    if(!(descricaoPiso==null || descricaoPiso=="" || descricaoPiso== undefined)){
      piso.descricaoPiso = descricaoPiso;
    }
    if(!(novoNumeroPiso==null || novoNumeroPiso=="" || novoNumeroPiso== undefined)){
      piso.novoNumeroPiso = Number(novoNumeroPiso);
    }
      this.updatePiso(piso);
    }           
  }
  
  private updatePiso(update: EditarPiso): void{
    let numeroPiso: number;
    let descricaoPiso: string;
    
    this.http.put<Piso>(this.pisoUrl, update, this.httpOptions)
    .pipe(catchError(this.handleError<Piso>('Editar Piso')))
    .subscribe({
        next: data=>{
          numeroPiso=data.numeroPiso;
          if(data.descricaoPiso==null)
            this.log("Número Piso: "+numeroPiso+" atualizado com sucesso!");
          else{
            descricaoPiso=data.descricaoPiso;
            this.log("Número Piso: "+numeroPiso+", descrição: "+descricaoPiso+" atualizado com sucesso!");
          }
          
      }
    });
  }

  public listarNumeroPisos(codigo: string): Observable<number[]> {
    return this.listarPisosNumero(codigo);
  }
  
  private listarPisosNumero(codigo: string): Observable<number[]> {
    let params = new HttpParams().set('codigo', codigo);
  
    return this.http.get<Piso[]>(this.pisoUrl, { params: params, headers: this.httpOptions.headers })
      .pipe(
        catchError(this.handleError<Piso[]>('Listar Piso')),
        map(data => data.map(item => item.numeroPiso))
      );
  }

  public listarPisosMapa(codigo: string): Observable<number[]> {
    return this.listPisosMapa(codigo);
  }

  private listPisosMapa(codigo: string): Observable<number[]> {
    let params = new HttpParams().set('codigo', codigo);
  
    return this.http.get<Piso[]>(this.pisoMapaUrl, { params: params, headers: this.httpOptions.headers })
      .pipe(
        catchError(this.handleError<Piso[]>('Listar Piso')),
        map(data => data.map(item => item.numeroPiso))
      );
  }

  public listarPisos(codigo: string): Observable<Piso[]> {
    return this.listPisos(codigo);
  }
  
  private listPisos(codigo: string): Observable<Piso[]> {
    let params = new HttpParams().set('codigo', codigo);
  
    return this.http.get<Piso[]>(this.pisoUrl, { params: params, headers: this.httpOptions.headers })
      .pipe(
        catchError(this.handleError<Piso[]>('Listar Piso'))
      );
  }

  public listarPisosServidosPorElevador(codigo: string): Observable<number[]> {
    let params = new HttpParams().set('codigoEd', codigo);
  
    return this.http.get<Piso[]>(this.pisoServidoPorElevadorUrl, { params: params, headers: this.httpOptions.headers })
      .pipe(
        catchError(this.handleError<Piso[]>('Listar Piso Servido por Elevador')),
        map(data => data.map(item => item.numeroPiso))
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

  validateData(codigo: string,
    numeroPiso: string): boolean{

    let flag:boolean = true;

    if(codigo==null || codigo=="" || codigo== undefined){
      this.log("ERRO: Código deve ser preenchido.");
      flag=false;
    }
    if(numeroPiso=="" || numeroPiso==undefined){
      this.log("ERRO: Número do Piso deve ser preenchido.");
      flag=false;
    }
    
    return flag;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, min, tap } from 'rxjs/operators';
import { Edificio } from '../dataModel/edificio';
import { devEnvironment } from 'src/environments/environment.development';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class EdificioService {

  private edificioUrl = devEnvironment.MDRI_API_URL + 'edificio';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }

  public listarCodEdificios(): Observable<string[]>{
    return this.listarEdificioCod();
  }


  public criarEdificio(codigo: string, dimensaoX: string, dimensaoY: string,
    nome?: string, descricao?: string): void {
    let dimensaoXNumero: number = +dimensaoX;
    let dimensaoYNumero: number = +dimensaoY;
    if(this.validateString(codigo) === false){
      this.log("Código não pode ser vazio");
      return;
    }

    if(this.validateNumber(dimensaoX, "Dimensão X") === false){
      return;
    }

    if(this.validateNumber(dimensaoY, "Dimensão Y") === false){
      return;
    }

    let edificio: any = {
      codigo: codigo,
      dimensaoX: dimensaoXNumero,
      dimensaoY: dimensaoYNumero,
    };
    if(nome && this.validateString(nome)){
      edificio.nome = nome;
    }
    if(descricao && this.validateString(descricao)){
      edificio.descricao = descricao;
    }

    this.http.post<Edificio>(this.edificioUrl, edificio as Edificio, this.httpOptions)
    .pipe(catchError(this.handleError<Edificio>('Criar Edificio')))
    .subscribe(data => {
      this.log(`Edificio com código: ${data.codigo} criado com sucesso!`);
    });
  }

  private listarEdificioCod(): Observable<string[]> {
    return this.http.get<Edificio[]>(this.edificioUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<Edificio[]>('Listar Edificio')),
        map(data => data.map(item => item.codigo))
      );
  }

  

  public editarEdificio(codigo: string, nome?: string, descricao?: string): void {
    if(this.validateString(codigo) === false){
      this.log("Código não pode ser vazio");
      return;
    }

    let edificio: any = {
      codigo: codigo,
    };
    let um = false;
    if(nome && this.validateString(nome)){
      edificio.nome = nome;
      um = true;
    }
    if(descricao && this.validateString(descricao)){
      edificio.descricao = descricao;
      um = true;
    }

    if(um === false){
      this.log("Nenhum campo para atualizar");
      return;
    }

    this.http.put<Edificio>(this.edificioUrl, edificio as Edificio, this.httpOptions)
    .pipe(catchError(this.handleError<Edificio>('Editar Edificio')))
    .subscribe(data => {
      this.log(`Edificio com código: ${data.codigo} editado com sucesso!`);
    });
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

  private validateString (data : string): boolean{
    if(data === null || data === undefined || data === ""){
      return false;
    }
    return true;
  }

  private validateNumber(data : string, dataName : string): boolean{
    if(data === null || data === undefined || data === ""){
      this.log(`${dataName} não pode ser vazio`);
      return false;
    }else if(isNaN(+data)){
      this.log(`${dataName} deve ser um número`);
      return false;
    }
    return true;
  }

  public listarEdificios(): Observable<Edificio[]> {
    let listaEdificios : Edificio[] = [];
    return this.http.get<Edificio[]>(this.edificioUrl, this.httpOptions)
    .pipe(catchError(this.handleError<Edificio[]>('Listar Edificio')));
  }

  public listarEdificioMinMaxPisos(minPisos: string, maxPisos: string): Observable<Edificio[]> {
    if(minPisos === null || minPisos === undefined || minPisos === ""){
      this.log(`O numero minimo de pisos não pode ser vazio`);
      return of([]);
    }else if(maxPisos === null || maxPisos === undefined || maxPisos === ""){
      this.log(`O numero maximo de pisos deve ser um número`);
      return of([]);
    }
    return this.listEdificioMinMaxPisos(Number(minPisos), Number(maxPisos));
  }
  
  private listEdificioMinMaxPisos(minPisos: number, maxPisos:number): Observable<Edificio[]> {
    let params = new HttpParams().set('minPisos', minPisos);
    params = params.append('maxPisos', maxPisos);
  
    return this.http.get<Edificio[]>(this.edificioUrl+"/listarMinEMaxPisos", { params: params, headers: this.httpOptions.headers })
      .pipe(
        catchError(this.handleError<Edificio[]>('Listar Edificio com Min e Max Pisos'))
      );
  }  

  public apagarEdificio(codigo: string): void {
    if(this.validateString(codigo) === false){
      this.log("Código não pode ser vazio");
      return;
    }

    let params = new HttpParams().set('codEdificio', codigo);
    this.http.delete<Edificio>(this.edificioUrl, { params: params, headers: this.httpOptions.headers })
    .pipe(catchError(this.handleError<Edificio>('Apagar Edifício')))
    .subscribe(data => {
      this.log(`Edificio com código: ${data.codigo} apagado com sucesso!`);
    });
  }
}

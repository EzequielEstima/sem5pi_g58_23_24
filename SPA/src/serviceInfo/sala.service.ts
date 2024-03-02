import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import Sala from 'src/dataModel/sala';
import { devEnvironment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  private salaUrl = devEnvironment.MDRI_API_URL + 'sala';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }


    criarSala(
        id: string,
        codigoEdificio: string,
        numeroPiso: number,
        descricao: string,
        categoria: string
        ): void {
      
    let sala: Sala;

    sala = {
        id: id, 
        codigoEdificio: codigoEdificio,
        numeroPiso: numeroPiso, 
        descricao: descricao, 
        categoria: categoria
    } as Sala;


    if(this.validateData(codigoEdificio, numeroPiso, descricao, categoria)){
      this.criar(sala);
    }
      
  }

  criar(sala: Sala): void{
    let id: string;
    let codigoEdificio: string;
    let numeroPiso: number;
    let descricao: string;
    let categoria: string;
    
    this.http.post<Sala>(this.salaUrl, sala, this.httpOptions)
    .pipe(catchError(this.handleError<Sala>('Adicionar sala ao piso')))
    .subscribe({
        next: data=>{ 
            id = data.id;
            codigoEdificio = data.codigoEdificio;
            numeroPiso = data.numeroPiso;
            descricao = data.descricao;
            categoria = data.categoria;


          if(data.id==null || data.categoria == null || data.codigoEdificio == null || data.descricao == null || data.numeroPiso == null){
            this.log("Erro ao criar sala porque existem parametros nulos!");
          }
          else{
          this.log("sala com id: "+id+", codigoEdificio: "+codigoEdificio+", numeroPiso: "+numeroPiso+", descricao: "+descricao+", categoria: "+categoria+" criada com sucesso!");
          }
      }
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

  validateData(
    codigoEdificio: string,
    numeroPiso: number,
    descricao: string,
    categoria: string,
    ): boolean{

    let flag:boolean = true;

    if(codigoEdificio == null){
      this.log("codigoEdificio é nulo!");
      flag = false;
    }
    if(numeroPiso == null){
      this.log("numeroPiso é nulo!");
      flag = false;
    }
    if(descricao == null){
      this.log("descricao é nula!");
      flag = false;
    }
    if(categoria == null){
      this.log("categoria é nula!");
      flag = false;
    }
    
    return flag;
  }
}

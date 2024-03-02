import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DadosPessoaisUser } from '../dataModel/dadosPessoaisUser';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { devEnvironment } from 'src/environments/environment.development';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  private authUrl = devEnvironment.AUTH_API_URL + 'user/'
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }

  public exportarDadosPessoais(): Observable<DadosPessoaisUser> {
    return this.http.get<DadosPessoaisUser>(this.authUrl + 'utente', this.httpOptions)
      .pipe(
        tap((dadosPessoais: DadosPessoaisUser) => {
          this.log('Os dados foram exportados com sucesso!'); // Log if the HTTP request is successful
        }),
        catchError(this.handleError<DadosPessoaisUser>('Exportar Dados Pessoais'))
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

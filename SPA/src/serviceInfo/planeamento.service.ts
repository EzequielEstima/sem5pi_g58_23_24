import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { devEnvironment } from 'src/environments/environment.development';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class PlaneamentoService {

  private planeamentoUrl = devEnvironment.MDRI_API_URL + 'planeamento';
  private caminhoEntreEdificios = this.planeamentoUrl + '/caminhoEntreEdificios';
  
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

  encontrar_caminhos(salaInicial: string, salaFinal: string): void{
    if(this.validar_salas(salaInicial, salaFinal)){
      let params = new HttpParams().set('salaInicial', salaInicial);
      params = params.append('salaFinal', salaFinal);
      
      this.http.get<string>(this.caminhoEntreEdificios, { params: params, headers: this.httpOptions.headers })
        .pipe(
          catchError(this.handleError<string>('Caminho entre edificios'))
        ).subscribe({
          next: data=>{
            this.log(data);
        }
      });;
    }
  }

  validar_salas(salaInicial: string, salaFinal: string): boolean{
    if(salaInicial == null || salaFinal == null || salaInicial == "" || salaFinal == "" || salaInicial == undefined || salaFinal == undefined){
      this.log("Erro: As salas tem de estar preenchidas");
      return false;
    }
    if(salaInicial == salaFinal){
      this.log("Erro: As salas são iguais");
      return false;
    }
    return true;
  }

}

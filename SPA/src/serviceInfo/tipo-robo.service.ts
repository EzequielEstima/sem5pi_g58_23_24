import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { TipoRobo } from '../dataModel/tipoRobo';
import { MessageService } from './message.service';
import { devEnvironment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TipoRoboService {
  private tipoRoboUrl = devEnvironment.MDRI_API_URL + 'tipoDispositivo';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private messageService: MessageService, private http: HttpClient) { }

  public criarTipoRobo(tipoTarefa: string[], marca: string, modelo: string): void {
    if(tipoTarefa.length === 0){
      this.log("Pelo menos um tipo de tarefa deve ser selecionado");
      return;
    }
    if(this.validateString(marca) === false){
      this.log("A marca não pode ser vazia");
      return;
    }

    if(this.validateString(modelo) === false){
      this.log("O modelo não pode ser vazio");
      return;
    }

    for(let i = 0; i < tipoTarefa.length; i++){
      if(tipoTarefa[i] === "Vigilância"){
        tipoTarefa[i] = "Vigilancia";
      }
    }
    
    let tipoRobo: TipoRobo = {
      tipoTarefa: tipoTarefa,
      marca: marca,
      modelo: modelo
    };

    this.http.post<TipoRobo>(this.tipoRoboUrl, tipoRobo as TipoRobo, this.httpOptions)
    .pipe(catchError(this.handleError<TipoRobo>('Criar Tipo de Robô')))
    .subscribe({next: data => {
      this.log(`Tipo de Robot com id ${data.idTipoDispositivo} criado com sucesso!`);
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

  private validateString (data : string): boolean{
    if(data === null || data === undefined || data === ""){
      return false;
    }
    return true;
  }

  public apagarTipoRobo(id: string): void {
    if(this.validateString(id) === false){
      this.log("Id não pode ser vazio");
      return;
    }

    let params = new HttpParams().set('idTipoDispositivo', id);
    this.http.delete<TipoRobo>(this.tipoRoboUrl, { params: params, headers: this.httpOptions.headers })
    .pipe(catchError(this.handleError<TipoRobo>('Apagar Tipo de Robot')))
    .subscribe(data => {
      this.log(`Tipo de robot: ${data.idTipoDispositivo} apagado com sucesso!`);
    });
  }
}

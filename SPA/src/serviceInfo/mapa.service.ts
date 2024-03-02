import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { devEnvironment } from 'src/environments/environment.development';


import CarregarMapa from 'src/dataModel/carregarMapa';
import { MessageService } from './message.service';
import ExportarMapa from 'src/dataModel/exportarMapa';
import {PlaneamentoCaminhosDTO} from 'src/dataModel/planeamentoCaminhosDTO';


@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor(private http: HttpClient, private messageService:MessageService) { }

  private mapaUrl = devEnvironment.MDRI_API_URL + 'mapa';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public carregarMapa(mapa : CarregarMapa): void {

    this.http.patch<CarregarMapa>(this.mapaUrl, mapa, this.httpOptions)
    .pipe(catchError(this.handleError<CarregarMapa>('Carregar Mapa')))
    .subscribe(data => {
      this.log(`Mapa do piso ${data.numeroPiso} do Edifício ${data.codigoEdificio} carregado com sucesso!`);
    });
  }

  public exportarMapa(codigo: string,numeroPiso: number): Observable<ExportarMapa> {
    let params = new HttpParams().set('codEdificio', codigo);
    params = params.append('numPiso', numeroPiso.toString());
    
    return this.http.get<ExportarMapa>(this.mapaUrl, { params: params, headers: this.httpOptions.headers })
      .pipe(
        catchError(this.handleError<ExportarMapa>('Exportar Mapa'))
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

  public exportarMapaAtravesDeUmaPassagemEPiso(idPassagem: number, codEd: string, numeroPiso: number): Observable<ExportarMapa> {
    let params = new HttpParams().set('idPassagem', idPassagem.toString());
    params = params.append('codEd', codEd);
    params = params.append('numeroPiso', numeroPiso.toString());
    
    return this.http.get<ExportarMapa>(this.mapaUrl + '/atravesDeUmaPassagemEPiso', { params: params, headers: this.httpOptions.headers })
      .pipe(
        catchError(this.handleError<ExportarMapa>('Exportar Mapa'))
      );
  }

  private log(message: string) {
    this.messageService.add(`${message}`);
  }


  exportarMapaParaOPlaneamento(): void{
    this.log("A carregar mapa para o planeamento, aguarde...");
    this.http.post<PlaneamentoCaminhosDTO>(this.mapaUrl + "/exportarMapaParaOPlaneamento", null,{ headers: this.httpOptions.headers })
      .pipe(
        catchError(this.handleError<PlaneamentoCaminhosDTO>('Exportar mapa para o planeamento'))
      ).subscribe({
        next: data=>{
          if(data != null && data != undefined){
            this.log("Mapa carregado com sucesso para o planeamento!");
          }
      }
    });;
  }
}

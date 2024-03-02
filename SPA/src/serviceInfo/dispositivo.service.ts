import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { devEnvironment } from 'src/environments/environment.development';
import { Dispositivo } from '../dataModel/dispositivo';
import { MessageService } from './message.service';
import CodigoDosDispositivosPorTarefa from 'src/dataModel/codigoDosDispositivosPorTarefa';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  private dispositivoUrl = devEnvironment.MDRI_API_URL + 'dispositivo';
  private dispositivoInibirUrl = devEnvironment.MDRI_API_URL + 'dispositivo/inibir';


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }


  adicionarDispositivoAFrota(codigo: string,
    nickname: string,
    idTipoDispositivo: string,
    numeroSerie: string,
    descricao: string): void {

    let dispositivo: Dispositivo;
    if (this.validateData(codigo, nickname, idTipoDispositivo, numeroSerie)) {
      if (descricao == null || descricao == "" || descricao == undefined) {
        dispositivo = { codigo: codigo, nickname: nickname, tipoDispositivo: Number(idTipoDispositivo), numeroSerie: numeroSerie } as Dispositivo;
      } else {
        dispositivo = { codigo: codigo, nickname: nickname, tipoDispositivo: Number(idTipoDispositivo), numeroSerie: numeroSerie, descricaoDispositivo: descricao } as Dispositivo;
      }
      this.addDispositivo(dispositivo);
    }

  }

  addDispositivo(dispositivo: Dispositivo): void {
    let codigo: string;
    let descricao: string;
    let estado: boolean;
    let nickname: string;
    let numeroSerie: string;

    this.http.post<Dispositivo>(this.dispositivoUrl, dispositivo, this.httpOptions)
      .pipe(catchError(this.handleError<Dispositivo>('Adicionar robo à frota')))
      .subscribe({
        next: data => {
          codigo = data.codigo;
          estado = data.estado;
          nickname = data.nickname;
          numeroSerie = data.numeroSerie;
          if (data.descricaoDispositivo == null)
            this.log("Dispositivo com código: " + codigo + ", estado: " + estado + ", nickname: " + nickname + ", número de Série: " + numeroSerie + " criado com sucesso!");
          else {
            descricao = data.descricaoDispositivo;
            this.log("Dispositivo com código: " + codigo + ", estado: " + estado + ", nickname: " + nickname + ", número de Série: " + numeroSerie + ", descrição: \"" + descricao + "\" criado com sucesso!");
          }

        }
      });
  }

  listarCodigoDosDispositivosDaFrotaPorTarefa(): Observable<CodigoDosDispositivosPorTarefa> {
    return this.http.get<CodigoDosDispositivosPorTarefa>(this.dispositivoUrl + "/tipoTarefa", this.httpOptions)
      .pipe(
        catchError(this.handleError<CodigoDosDispositivosPorTarefa>('Listar Códigos dos Dispositivos da Frota por Tarefa')),
      );
  }


  inibirDispositivo(codigo: string): void {

    let robo: Dispositivo;

    robo = {
      codigo: codigo,
    } as Dispositivo;


    if (this.validateDataInibir(codigo)) {
      this.inibir(robo);
    }

  }

  inibir(robo: Dispositivo): void {
    let codigo: string;

    this.http.patch<Dispositivo>(this.dispositivoInibirUrl, robo, this.httpOptions)
      .pipe(catchError(this.handleError<Dispositivo>('Inibir Robo')))
      .subscribe({
        next: data => {
          codigo = data.codigo;

          if (data.estado == false)
            this.log("Estado alterado com sucesso!");
          else {
            this.log("Estado não foi alterado!");
          }
        }
      });
  }


  public listarCod(): Observable<string[]> {
    return this.listarCodDispositivos();
  }

  private listarCodDispositivos() {
    return this.http.get<Dispositivo[]>(this.dispositivoUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<Dispositivo[]>('Listar Dispositivos')),
        map(data => data.map(item => item.codigo))
      );
  }

  public listarDispositivosFrota(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.dispositivoUrl, this.httpOptions)
    .pipe(
      catchError(this.handleError<Dispositivo[]>('Listar Dispositivos da frota')),
      map(data => data.map(item => item))
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
    nickname: string,
    idTipoDispositivo: string,
    numeroSerie: string): boolean {

    let flag: boolean = true;

    if (codigo == null || codigo == "" || codigo == undefined) {
      this.log("ERRO: Código deve ser preenchido.");
      flag = false;
    }
    if (nickname == "" || nickname == undefined || nickname == null) {
      this.log("ERRO: Nickname deve ser preenchido.");
      flag = false;
    }
    if (idTipoDispositivo == "" || idTipoDispositivo == undefined) {
      this.log("ERRO: Id Tipo Dispositivo deve ser preenchido.");
      flag = false;
    }
    if (numeroSerie == "" || numeroSerie == undefined || numeroSerie == null) {
      this.log("ERRO: Número de Série deve ser preenchido.");
      flag = false;
    }

    return flag;
  }

  validateDataInibir(codigo: string): boolean {

    let flag: boolean = true;

    if (codigo == null || codigo == "" || codigo == undefined) {
      this.log("ERRO: Código deve ser preenchido.");
      flag = false;
    }

    return flag;
  }

}

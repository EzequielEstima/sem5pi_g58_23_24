import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import Passagem from 'src/dataModel/passagem';
import ListarPisoComPassagem from 'src/dataModel/listarPisoPassagem';
import { ListarPassagem } from 'src/dataModel/listarPassagem';
import { devEnvironment } from 'src/environments/environment.development';

interface TabelaInfo {
  idPassagem: string;
  passagem: string;
  pisoInfo: string;
  edificio: string;
}

@Injectable({
  providedIn: 'root'
})

export class PassagemService {

  private passagemUrl = devEnvironment.MDRI_API_URL +'passagem';
  private passagemUrl2 = devEnvironment.MDRI_API_URL +'passagem/editarPassagens';
  private passagemUrl3 =  devEnvironment.MDRI_API_URL +'passagem/listarPisosComPassagens';
  private passagemUrlMain = devEnvironment.MDRI_API_URL + 'passagem';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private messageService: MessageService, private http: HttpClient) { }


  editarPassagem(
    id: number, 
    codigoEdificioA: string,
    codigoEdificioB: string,
    numeroPisoA: number, 
    numeroPisoB: number) {

      let passagem: Passagem;

      passagem = {
          id: id, 
          codigoEdificioA: codigoEdificioA,
          codigoEdificioB: codigoEdificioB, 
          numeroPisoA: numeroPisoA, 
          numeroPisoB: numeroPisoB
      } as Passagem;

      if(this.validateData(codigoEdificioA, codigoEdificioB, numeroPisoA, numeroPisoB)){
        this.editar(passagem);
      }
    
  }
 
  editar(passagem: Passagem): void{
    let id: number;
    let codigoEdificioA: string;
    let codigoEdificioB: string;
    let numeroPisoA: number;
    let numeroPisoB: number;
    
    this.http.put<Passagem>(this.passagemUrl2, passagem, this.httpOptions)
    .pipe(catchError(this.handleError<Passagem>('Editar passagem entre pisos')))
    .subscribe({
        next: data=>{ 
            id = data.id;
            codigoEdificioA = data.codigoEdificioA;
            codigoEdificioB = data.codigoEdificioB;
            numeroPisoA = data.numeroPisoA;
            numeroPisoB = data.numeroPisoB;

          if(data.id==null || data.codigoEdificioA == null || data.codigoEdificioB == null || data.numeroPisoA == null || data.numeroPisoB == null){
            this.log("Erro ao editar passagem porque existem parametros nulos!");
          }
          else{
          this.log("passagem com id: "+id+", codigoEdificioA: "+codigoEdificioA+", codigoEdificioB: "+ codigoEdificioB +", numeroPisoA: "+ numeroPisoA + ", numeroPisoB: "+ numeroPisoB + " editado com sucesso!");
          }
          
      }
    });
  }

    criarPassagem(
        id: number,
        codigoEdificioA: string,
        codigoEdificioB: string,
        numeroPisoA: number,
        numeroPisoB: number,
        ): void {
      
    let passagem: Passagem;

    passagem = {
        id: id, 
        codigoEdificioA: codigoEdificioA,
        codigoEdificioB: codigoEdificioB, 
        numeroPisoA: numeroPisoA, 
        numeroPisoB: numeroPisoB
    } as Passagem;

    if(this.validateData(codigoEdificioA, codigoEdificioB, numeroPisoA, numeroPisoB)){
   
      this.criar(passagem);
    }
      
  }

  criar(passagem: Passagem): void{
    let id: number;
    let codigoEdificioA: string;
    let codigoEdificioB: string;
    let numeroPisoA: number;
    let numeroPisoB: number;
    
    this.http.post<Passagem>(this.passagemUrl, passagem, this.httpOptions)
    .pipe(catchError(this.handleError<Passagem>('Adicionar passagem entre pisos')))
    .subscribe({
        next: data=>{ 
            id = data.id;
            codigoEdificioA = data.codigoEdificioA;
            codigoEdificioB = data.codigoEdificioB;
            numeroPisoA = data.numeroPisoA;
            numeroPisoB = data.numeroPisoB;


          if(data.id==null || data.codigoEdificioA == null || data.codigoEdificioB == null || data.numeroPisoA == null || data.numeroPisoB == null){
            this.log("Erro ao criar passagem porque existem parametros nulos!");
          }
          else{
          this.log("passagem com id: "+id+", codigoEdificioA: "+codigoEdificioA+", codigoEdificioB: "+ codigoEdificioB +", numeroPisoA: "+ numeroPisoA + ", numeroPisoB: "+ numeroPisoB + " criado com sucesso!");
          }
          
      }
    });
  }

  listarPisoComPassagem() : Observable<TabelaInfo[]>{
    return this.http.get<ListarPisoComPassagem>(this.passagemUrl3, this.httpOptions) // Substitua any com o tipo correto se disponível
      .pipe(
        catchError(this.handleError<ListarPisoComPassagem>('Listar Pisos com passagens')), // Substitua any com o tipo correto se disponível
        map(data => this.processarDadosParaTabela(data))
      );
  }
  
  private processarDadosParaTabela(data: ListarPisoComPassagem): TabelaInfo[] {

  let tabelaInfo: TabelaInfo[] = [];

  let idPassagem: string[] = [];
  let passagem: string[] = [];
  let pisoInfo: string[] = [];
  let edificio: string[] = [];

  let i = 0;

    // Mapeando passagens para pares de pisos
    data.mapIdPassagemPairIdPiso.forEach(item => {
        idPassagem.push(item.first.toString());
        passagem.push(item.second.first.toString() + " -> " + item.second.second.toString());
        i++;
    });

    // Mapeando números e IDs de pisos para descrições
    data.pairNumeroPisoIdPisoPairDescricao.forEach(item => {
        pisoInfo.push(item.first.first.toString() + " - " + item.first.second.toString()+": "+item.second);
    });

    // Mapeando IDs de piso para IDs de edifícios
    data.pairIdPisoIdEdificio.forEach(item => {
        edificio.push(item.first.toString() + "-" + item.second);
    });

    if (i==0) {return tabelaInfo}

    let g = 0;
    for (let j = 0; j < i; j++) {
      
      let dado = {
        idPassagem: idPassagem[j],
        passagem: passagem[j],
        pisoInfo: pisoInfo[g] + ";" + pisoInfo[g+1],
        edificio: edificio[g] + ";" + edificio[g+1]
      }
      tabelaInfo.push(dado);

      g = g+2;
    } 

    return tabelaInfo;
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
    codigoEdificioA: string,
    codigoEdificioB: string,
    numeroPisoA: number,
    numeroPisoB: number,
    ): boolean{

    let flag:boolean = true;

    if(codigoEdificioA==null || codigoEdificioA=="" || codigoEdificioA==undefined){
      this.log("Código do edifício A não pode ser vazio!");
      flag=false;
    }
    if(codigoEdificioB==null || codigoEdificioB=="" || codigoEdificioB==undefined){
      this.log("Código do edifício B não pode ser vazio!");
      flag=false;
    }
    if(numeroPisoA==null || numeroPisoA == undefined){
      this.log("Número do piso A não pode ser vazio!");
      flag=false;
    }
    if(numeroPisoB==null || numeroPisoB == undefined){
      this.log("Número do piso B não pode ser vazio!");
      flag=false;
    }
    
    return flag;
  }

  public listarPassagensPorEdificios(cod1: string, cod2: string){

    let params = new HttpParams().set('edificioACod', cod1);
    params = params.append('edificioBCod', cod2);


    return this.http.get<ListarPassagem[]>(this.passagemUrlMain +'/listarPassagensPorParDeEdificios' , 
    { params: params, headers: this.httpOptions.headers })
    .pipe(
      catchError(this.handleError<ListarPassagem[]>('Listar passagens por par de edificios')),
      map(data => data.map(item => item))
    );
  }
}

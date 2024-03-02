import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { NumeroPiso } from "./NumeroPiso";
import { DescricaoPiso } from "./DescricaoPiso";
import { Guard } from "../../core/logic/Guard";
import { IdPiso } from "./IdPiso";
import { Mapa } from "../mapa/Mapa";



interface pisoProps {
  numeroPiso: NumeroPiso;
  descricaoPiso: DescricaoPiso;
  mapa: Mapa;
}

export class Piso extends AggregateRoot<pisoProps> {
  public hasMapa(): boolean{
    return !!this.props.mapa;
  }
  returnMapa() {
    return this.props.mapa;
  }

  public returnIdPiso() : number{
    return Number(this._id.toValue());
  }

  public returnNumeroPiso() : number{
    return this.props.numeroPiso.props.nPiso;
  }

  public returnDescricaoPiso() : string{
    return this.props.descricaoPiso.props.descricao;
  }

  public returnIdMapa() : number{
    return this.props.mapa.returnIdMapa();
  }

  private constructor (props : pisoProps, id?: IdPiso) {
      super(props,id);
  }

  public static create (props: pisoProps, id?: IdPiso): Result<Piso> {

    const guardedProps = [
      { argument: props.numeroPiso, argumentName: 'numeroPiso' },
      { argument: props.descricaoPiso, argumentName: 'descricaoPiso' },
      { argument: props.mapa, argumentName: 'mapa' },
    ];

    let guard1 = Guard.againstNullOrUndefined(guardedProps[0].argument,guardedProps[0].argumentName);

    let guardResult = Guard.combine([guard1]);

    if (!guardResult.succeeded) {
      return Result.fail<Piso>(guardResult.message)
    }     
    else {
      const piso = new Piso({
        ...props
      }, id);

      return Result.ok<Piso>(piso);
    }
  }
  /*
  public returnPontosParaElevador(xCoordSup: number, yCoordSup: number, orientacao : string) : Ponto[]{
    let pontos: Ponto[] = [];

    pontos.push(this.props.mapa[xCoordSup][yCoordSup]);

    if (orientacao === 'Norte'){  
      pontos.push(this.props.mapa[xCoordSup][yCoordSup+1]);
    }else if(orientacao === 'Oeste'){
      pontos.push(this.props.mapa[xCoordSup+1][yCoordSup]);
    }

    return pontos;
  }
  public verificarSeMapaVazio() : boolean{
    let x = this.props.mapa.length;
    let y = this.props.mapa[0].length;
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y ; j++) {
        if(this.props.mapa[i][j].returnTipoPonto() !== " "){
          return false;
        }
      }
    }
    return true;
  }

  public criacaoBermasPiso() : Ponto[]{
    let x = this.props.mapa[0].length - 1;
    let y = this.props.mapa.length - 1;

    let listaPontos : Ponto[] = [];
    for (let i = 0; i <= x; i++) {
      for (let j = 0; j <= y ; j++) {
          if(i == 0 && j ==0 ) {
            this.props.mapa[i][j].toParedeNorteOeste();
            listaPontos.push(this.props.mapa[i][j]);
          }
          else if((1 <= i && i < x && (j == 0 || j == y)) || (i == 0 && j == y)) {
            this.props.mapa[i][j].toParedeNorte();
            listaPontos.push(this.props.mapa[i][j]);
          }
          else if((1 <= j && j < y && (i == 0 || i == x)) || (i == x && j == 0)) {
            this.props.mapa[i][j].toParedeOeste();
            listaPontos.push(this.props.mapa[i][j]);
          }
          else{this.props.mapa[i][j].toVazio();}
      }
    }  
    return listaPontos;
  }

  public returnPontosParaPassagem(xCoordSup: number, yCoordSup: number, orientacao : string) : Ponto[]{
    let pontos: Ponto[] = [];

    if (orientacao === 'Norte'){
      if(this.props.mapa[xCoordSup][yCoordSup].returnTipoPonto() === 'Oeste' || this.props.mapa[xCoordSup][yCoordSup].returnTipoPonto() === 'NorteOeste'){
        this.props.mapa[xCoordSup][yCoordSup].toPassagemOeste();
      }else{
        this.props.mapa[xCoordSup][yCoordSup].toPassagem();
      }
      this.props.mapa[xCoordSup + 1][yCoordSup].toPassagem();
      pontos.push(this.props.mapa[xCoordSup][yCoordSup]);
      pontos.push(this.props.mapa[xCoordSup+1][yCoordSup]);
    }else if(orientacao === 'Oeste'){
      if(this.props.mapa[xCoordSup][yCoordSup].returnTipoPonto() === 'Norte' || this.props.mapa[xCoordSup][yCoordSup].returnTipoPonto() === 'NorteOeste'){
        this.props.mapa[xCoordSup][yCoordSup].toPassagemNorte();
      }else{
        this.props.mapa[xCoordSup][yCoordSup].toPassagem();
      }
      this.props.mapa[xCoordSup][yCoordSup + 1].toPassagem();
      pontos.push(this.props.mapa[xCoordSup][yCoordSup]);
      pontos.push(this.props.mapa[xCoordSup][yCoordSup+1]);
    }
    return pontos;
  }

  public returnPontosParaDiagonalSala(abcissaA: number, ordenadaA: number, abcissaB: number, ordenadaB: number) : Ponto[]{
    let pontos: Ponto[] = [];
    let xCoordSup;
    let yCoordSup;
    let xCoordInf;
    let yCoordInf;

    if(abcissaA < abcissaB){
      xCoordSup = abcissaA;
      xCoordInf = abcissaB;
    }else{
      xCoordSup = abcissaB;
      xCoordInf = abcissaA;
    }
    if(ordenadaA < ordenadaB){
      yCoordSup = ordenadaA;
      yCoordInf = ordenadaB;
    }else{
      yCoordSup = ordenadaB;
      yCoordInf = ordenadaA;
    }
    
    this.props.mapa[xCoordSup][yCoordSup].toParedeNorteOeste();
    this.props.mapa[xCoordSup][yCoordInf].toVazio();
    pontos.push(this.props.mapa[xCoordSup][yCoordSup]);
    pontos.push(this.props.mapa[xCoordInf][yCoordInf]);
    return pontos;
  }

  public returnPontosParaParedesSalas(abcissaA : number, ordenadaA : number, abcissaB : number, ordenadaB : number,
         abcissaPorta : number, ordenadaPorta : number) : Ponto[]{
    let pontos: Ponto[] = [];
    let xCoordSup;
    let yCoordSup;
    let xCoordInf;
    let yCoordInf;

    if(abcissaA < abcissaB){
      xCoordSup = abcissaA;
      xCoordInf = abcissaB;
    }else{
      xCoordSup = abcissaB;
      xCoordInf = abcissaA;
    }
    if(ordenadaA < ordenadaB){
      yCoordSup = ordenadaA;
      yCoordInf = ordenadaB;
    }else{
      yCoordSup = ordenadaB;
      yCoordInf = ordenadaA;
    }

    this.props.mapa[abcissaPorta][ordenadaPorta].toPorta();
    
    for(let i = xCoordSup + 1; i <= xCoordInf; i++){
      if(this.props.mapa[i][yCoordSup].returnIdPonto() !== this.props.mapa[abcissaPorta][ordenadaPorta].returnIdPonto()){
        this.props.mapa[i][yCoordSup].toParedeNorte();
        pontos.push(this.props.mapa[i][yCoordSup]);
      }else{
        this.props.mapa[abcissaPorta][ordenadaPorta].toPortaNorte();
      }
    }
    
    for(let i = xCoordSup; i <= xCoordInf; i++){
      this.props.mapa[i][yCoordInf + 1];
      if(this.props.mapa[i][yCoordInf + 1].returnIdPonto() !== this.props.mapa[abcissaPorta][ordenadaPorta].returnIdPonto()){
        this.props.mapa[i][yCoordInf + 1].toParedeNorte();
        pontos.push(this.props.mapa[i][yCoordInf + 1]);
      }else{
        this.props.mapa[abcissaPorta][ordenadaPorta].toPortaNorte();
      }
    }
    
    for(let i = yCoordSup + 1; i <= yCoordInf; i++){
      if(this.props.mapa[xCoordSup][i].returnIdPonto() !== this.props.mapa[abcissaPorta][ordenadaPorta].returnIdPonto()){
        this.props.mapa[xCoordSup][i].toParedeOeste();
        pontos.push(this.props.mapa[xCoordSup][i]);
      }else{
        this.props.mapa[abcissaPorta][ordenadaPorta].toPortaOeste();
      }
    }
    
    for(let i = yCoordSup; i <= yCoordInf; i++){
      if(this.props.mapa[xCoordInf + 1][i].returnIdPonto() !== this.props.mapa[abcissaPorta][ordenadaPorta].returnIdPonto()){
        if(this.props.mapa[xCoordInf + 1][i].returnTipoPonto() === 'Norte'){
          this.props.mapa[xCoordInf + 1][i].toParedeNorteOeste();
        }else{
          this.props.mapa[xCoordInf + 1][i].toParedeOeste();
        }
        pontos.push(this.props.mapa[xCoordInf + 1][i]);
      }else{
        if(this.props.mapa[xCoordInf + 1][i].returnTipoPonto() === 'Norte'){
          this.props.mapa[abcissaPorta][ordenadaPorta].toPortaNorteOeste();
        }else{
          this.props.mapa[abcissaPorta][ordenadaPorta].toPortaOeste();
        }
      }
    }
    pontos.push(this.props.mapa[abcissaPorta][ordenadaPorta]);
    return pontos;
  }
  /**
   * Elimina o elevador do mapa, mudando o tipo dos pontos para parede ou vazio
   * @param coords array com as coordenadas dos ponto do elevador
   */
  /*
  public reverterElevadorNoMapa(coords: number[]){
    let x = this.props.mapa.length;
    let y = this.props.mapa[0].length;
    
    for (let i = 0; i < coords.length; i = i+2){
      if(coords[i] == 0 && coords[i+1] ==0 ) {
        this.props.mapa[coords[i]][coords[i+1]].toParedeNorteOeste(); //"NorteOeste"
      } else if(coords[i] == x-1 && coords[i+1] == y-1 ) {
       this.props.mapa[coords[i]][coords[i+1]].toVazio(); //" "
      }else if((coords[i+1] == y-1) || (coords[i+1] == 0)) {
        this.props.mapa[coords[i]][coords[i+1]].toParedeNorte(); //"Norte"
      }else if ((coords[i] == x-1) || (coords[i] == 0)){
        this.props.mapa[coords[i]][coords[i+1]].toParedeOeste();//"Oeste"
      }else{
        this.props.mapa[coords[i]][coords[i+1]].toVazio(); //" "
      }
    }
  }
  /*
  public returnPontosComCoordenadas(coords: number[]): Ponto[]{
    let pontos: Ponto[] = [];

    for (let i = 0; i < coords.length; i = i+2){
      pontos.push(this.props.mapa[coords[i]][coords[i+1]]);
    }
    return pontos;
  }
  */
  public atualizarNumeroPiso(numeroPiso: NumeroPiso): Result<Piso>{
    let guard = Guard.againstNullOrUndefined(numeroPiso,'numero do piso');
    if (!guard.succeeded) {
      return Result.fail<Piso>(guard.message)
    }
    this.props.numeroPiso = numeroPiso;
    return Result.ok<Piso>(this);
  }

  public atualizarDescricaoPiso(descricaoPiso: DescricaoPiso): Result<Piso>{
    let guard = Guard.againstNullOrUndefined(descricaoPiso,'descricao do piso');
    if (!guard.succeeded) {
      return Result.fail<Piso>(guard.message)
    }
    this.props.descricaoPiso = descricaoPiso;
    return Result.ok<Piso>(this);
  }

  public adicionarMapa(mapa: Mapa): Result<boolean>{
    let guard = Guard.againstNullOrUndefined(mapa,'mapa');
    if (!guard.succeeded) {
      return Result.fail<boolean>(guard.message)
    }
    this.props.mapa = mapa;
    return Result.ok<boolean>(true);
  }

  public getCoordenadasVigilancia(): number[]{
    return this.props.mapa.getCoordenadasVigilancia();
  }
}
import { Mapper } from "../core/infra/Mapper";
import { Container } from 'typedi';

import { Document, Model } from 'mongoose';

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import ICarregarMapaDTO from "../dto/ICarregarMapaDTO";
import { Mapa } from "../domain/mapa/Mapa";
import { IdMapa } from "../domain/mapa/IdMapa";
import { TipoPonto } from "../domain/mapa/TipoPonto";
import { CoordenadasPassagem } from "../domain/mapa/CoordenadasPassagem";
import { CoordenadasElevador } from "../domain/mapa/CoordenadasElevador";
import { CoordenadasSala } from "../domain/mapa/CoordenadasSala";


export class MapaMap extends Mapper<Mapa> {
  
  public static toDTO(mapa: Mapa): ICarregarMapaDTO {
    //toDo
    return null
  }

  public static async toDomain (raw: any): Promise<Mapa> {
    let idMapa = IdMapa.create(raw.idMapa).getValue();  
    let mapa: TipoPonto [][] = [];
    if  (raw.mapa !== null && raw.mapa !== undefined){
      for (let i = 0; i < raw.mapa.length; i++) {
        mapa[i]=[];
        for (let j = 0; j < raw.mapa[i].length; j++) {
          mapa[i][j] = TipoPonto.create(raw.mapa[i][j]).getValue();
        }
      }    
    }
    let coordenadasPassagem: CoordenadasPassagem [] = [];
    if  (raw.idPassagem !== null && raw.idPassagem !== undefined){
      for (let i = 0; i < raw.idPassagem.length; i++) {
        let propsPassagem = {
          id : raw.idPassagem[i],
          abcissaSup : raw.abcissaSupPassagem[i],
          ordenadaSup : raw.ordenadaSupPassagem[i],
          abcissaInf : raw.abcissaInfPassagem[i],
          ordenadaInf : raw.ordenadaInfPassagem[i],
          orientacao : raw.orientacaoPassagem[i]
        }
        coordenadasPassagem[i] = CoordenadasPassagem.create(propsPassagem).getValue();
      }
    }
    let coordenadasElevador : CoordenadasElevador;
    if  (raw.xCoordElevador !== null && raw.xCoordElevador !== undefined){
      let propsElevador= {
        xCoord : raw.xCoordElevador,
        yCoord : raw.yCoordElevador,
        orientacao : raw.orientacaoElevador
      }
      coordenadasElevador = CoordenadasElevador.create(propsElevador).getValue();
    }
    let coordenadasSala: CoordenadasSala [] = [];
    if  (raw.nomeSala !== null && raw.nomeSala !== undefined){
      for (let i = 0; i < raw.nomeSala.length; i++) {
        let propsSala= {
          nome : raw.nomeSala[i],
          abcissaA : raw.abcissaASala[i],
          ordenadaA : raw.ordenadaASala[i],
          abcissaB : raw.abcissaBSala[i],
          ordenadaB : raw.ordenadaBSala[i],
          abcissaPorta : raw.abcissaPorta[i],
          ordenadaPorta : raw.ordenadaPorta[i],
          orientacaoPorta : raw.orientacaoPorta[i],
        }
        coordenadasSala[i] = CoordenadasSala.create(propsSala).getValue();
      }
    }
    
    const mapaOrError = Mapa.create({
      mapa: mapa,
      coordenadasPassagem: coordenadasPassagem,
      coordenadasElevador: coordenadasElevador,
      coordenadasSala: coordenadasSala
    }, idMapa);
    
    mapaOrError.isFailure ? console.log(mapaOrError.error) : '';
    
    return mapaOrError.isSuccess ? mapaOrError.getValue() : null;

  }

  public static toPersistence (mapa: Mapa): any {
    let dadosMapa : any = {
      idMapa: mapa.returnIdMapa(),
      mapa: mapa.returnTipoDePontos(),
    }

    if(mapa.verificaSeExistePassagens()){
      dadosMapa.idPassagem = mapa.returnIdPassagem();
      dadosMapa.abcissaSupPassagem =  mapa.returnAbcissaSupPassagem();
      dadosMapa.ordenadaSupPassagem = mapa.returnOrdenadaSupPassagem();
      dadosMapa.abcissaInfPassagem = mapa.returnAbcissaInfPassagem();
      dadosMapa.ordenadaInfPassagem = mapa.returnOrdenadaInfPassagem();
      dadosMapa.orientacaoPassagem = mapa.returnOrientacaoPassagem();
    }
    
    if(mapa.verificaSeExisteElevador()){
      dadosMapa.xCoordElevador = mapa.returnXCoordElevador();
      dadosMapa.yCoordElevador = mapa.returnYCoordElevador();
      dadosMapa.orientacaoElevador = mapa.returnOrientacaoElevador();
    }
    
    if(mapa.verificaSeExisteSalas()){
      dadosMapa.nomeSala = mapa.returnNomeSala();
      dadosMapa.abcissaASala = mapa.returnAbcissaASala();
      dadosMapa.ordenadaASala = mapa.returnOrdenadaASala();
      dadosMapa.abcissaBSala = mapa.returnAbcissaBSala();
      dadosMapa.ordenadaBSala = mapa.returnOrdenadaBSala();
      dadosMapa.abcissaPorta = mapa.returnAbcissaPortaSala();
      dadosMapa.ordenadaPorta = mapa.returnOrdenadaPortaSala();
      dadosMapa.orientacaoPorta = mapa.returnOrientacaoPortaSala();
    }
  
    return dadosMapa;
  }
}
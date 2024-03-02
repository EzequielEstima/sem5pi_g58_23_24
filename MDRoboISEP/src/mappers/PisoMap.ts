import { Mapper } from "../core/infra/Mapper";
import { Container } from 'typedi';

import { Document, Model } from 'mongoose';
import { IPisoPersistence } from '../dataschema/IPisoPersistence';

import IPisoDTO from "../dto/IPisoDTO";
import { Piso } from "../domain/piso/Piso";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { NumeroPiso } from "../domain/piso/NumeroPiso";
import { DescricaoPiso } from "../domain/piso/DescricaoPiso";
import { IdPiso } from "../domain/piso/IdPiso";
import { Ponto } from "../domain/ponto/Ponto"
import PontoRepo from "../repos/PontoRepo";
import MapaRepo from "../repos/MapaRepo";
import { MapaMap } from "./MapaMap";
import { Mapa } from "../domain/mapa/Mapa";


export class PisoMap extends Mapper<Piso> {
  
  public static toDTO(piso: Piso): IPisoDTO {
    let dadosPiso : any = {
      id: piso.returnIdPiso(),
      numeroPiso: piso.returnNumeroPiso(), 
    }

    
    if(piso.props.descricaoPiso !== undefined && piso.props.descricaoPiso !== null){
      dadosPiso.descricaoPiso = piso.returnDescricaoPiso();
    }

    return dadosPiso as IPisoDTO;
  }

  public static async toDomain (raw: any): Promise<Piso> {
    let dadosPiso : any = {
      numeroPiso: NumeroPiso.create(raw.numeroPiso).getValue()      
    }
    
    if  (raw.descricaoPiso !== null && raw.descricaoPiso !== undefined){
      const descricaoPisoOrError = DescricaoPiso.create(raw.descricaoPiso);
      dadosPiso.descricaoPiso = descricaoPisoOrError.getValue();
    }
    const IdPisoError = IdPiso.create(Number(raw.domainID));

    
    
    if  (raw.mapa !== null && raw.mapa !== undefined){
      const repo = Container.get(MapaRepo);
      dadosPiso.mapa = await repo.findByDomainId(raw.mapa);    
    }
    const userOrError = Piso.create(
      dadosPiso, IdPisoError.getValue())

    userOrError.isFailure ? console.log(userOrError.error) : '';
    
    return userOrError.isSuccess ? userOrError.getValue() : null;
    
  }

  public static toPersistence (piso: Piso): any {
    let dadosPiso : any = {
      domainID: piso.returnIdPiso(),
      numeroPiso: piso.returnNumeroPiso(),
    }

    if(piso.props.mapa !== undefined && piso.props.mapa !== null){
      dadosPiso.mapa = piso.returnIdMapa();
    }
    
    if(piso.props.descricaoPiso !== undefined && piso.props.descricaoPiso !== null){
      dadosPiso.descricaoPiso = piso.returnDescricaoPiso();
    }

    return dadosPiso;
  }
}
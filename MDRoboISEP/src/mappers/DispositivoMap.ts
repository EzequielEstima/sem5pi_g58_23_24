import { Mapper } from "../core/infra/Mapper";
import { Container } from 'typedi';

import { Document, Model } from 'mongoose';

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Dispositivo } from "../domain/dispositivo/Dispositivo";
import IDispositivoDTO from "../dto/IDispositivoDTO";
import { DescricaoDispositivo } from "../domain/dispositivo/DescricaoDispositivo";
import { EstadoDispositivo } from "../domain/dispositivo/EstadoDispositivo";
import { Nickname } from "../domain/dispositivo/Nickname";
import { NumeroDeSerie } from "../domain/dispositivo/NumeroDeSerie";
import TipoDispositivoRepo from "../repos/TipoDispositivoRepo";


export class DispositivoMap extends Mapper<Dispositivo> {
  
  public static toDTO(dispositivo: Dispositivo): IDispositivoDTO {
    let dadosDispositivo : any = {
        codigo: dispositivo.returnCodigoDispositivo(),
        estado: dispositivo.returnEstado(),
        nickname: dispositivo.returnNickname(),
        numeroSerie: dispositivo.returnNumeroSerie(),      
      }
  
      
    if(dispositivo.props.descricaoDispositivo !== undefined && dispositivo.props.descricaoDispositivo !== null){
        dadosDispositivo.descricaoDispositivo = dispositivo.returnDescricaoDispositivo();
    }


    return dadosDispositivo as IDispositivoDTO;
  }

  public static async toDomain (raw: any): Promise<Dispositivo> {
    const repo = Container.get(TipoDispositivoRepo);
    let dadosDispositivo : any = {
        estado:  EstadoDispositivo.create(raw.estado).getValue(),
        nickname: Nickname.create(raw.nickname).getValue(),
        numeroSerie: NumeroDeSerie.create(raw.numeroSerie).getValue(),
        tipoDeDispositivo: await repo.findByDomainId(raw.tipoDeDispositivo)      
      }
    
    if  (raw.descricaoDispositivo !== null && raw.descricaoDispositivo !== undefined){
        dadosDispositivo.descricaoDispositivo = DescricaoDispositivo.create(raw.descricaoDispositivo).getValue();
        }
    
    const dispositivoOrError = Dispositivo.create(
        dadosDispositivo, new UniqueEntityID(raw.codigo)
    )

    dispositivoOrError.isFailure ? console.log(dispositivoOrError.error) : '';
    
    return dispositivoOrError.isSuccess ? dispositivoOrError.getValue() : null;
    
  }

  public static toPersistence (dispositivo: Dispositivo): any {
    let dadosDispositivo : any = {
        codigo: dispositivo.returnCodigoDispositivo(),
        estado: dispositivo.returnEstado(),
        nickname: dispositivo.returnNickname(),
        numeroSerie: dispositivo.returnNumeroSerie(),
        tipoDeDispositivo: dispositivo.props.tipoDeDispositivo.returnIdTipoDispositivo() 
      }
  
      
    if(dispositivo.props.descricaoDispositivo !== undefined && dispositivo.props.descricaoDispositivo !== null){
        dadosDispositivo.descricaoDispositivo = dispositivo.returnDescricaoDispositivo();
    }

    return dadosDispositivo;
  }
}
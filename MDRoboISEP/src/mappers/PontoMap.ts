import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IPontoPersistence } from '../dataschema/IPontoPersistence';

import IPontoDTO from "../dto/IPontoDTO";
import { Ponto } from "../domain/ponto/Ponto";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { TipoPonto } from "../domain/ponto/TipoPonto";
import { Coordenadas } from "../domain/ponto/Coordenadas";
import { IdPonto } from "../domain/ponto/IdPonto";


export class PontoMap extends Mapper<Ponto> {
  
  public static toDTO(ponto: Ponto): IPontoDTO {
    return {
      id: ponto.returnIdPonto(),
      abscissa: ponto.returnAbscissa(),
      ordenada: ponto.returnOrdenada(),
      tipoPonto: ponto.returnTipoPonto()
    } as IPontoDTO;
  }

  public static toDomain (raw: any): Ponto {
    
    const coordenadasPisoOrError = Coordenadas.create({abscissa: raw.abscissa , ordenada: raw.ordenada});
    const tipoPontoOrError = TipoPonto.create(raw.tipoPonto);
    const idPontoError = IdPonto.create(raw.domainID);

    const userOrError = Ponto.create({
        coordenadas: coordenadasPisoOrError.getValue(),
        tipoPonto: tipoPontoOrError.getValue(),
    },  idPontoError.getValue())

    userOrError.isFailure ? console.log(userOrError.error) : '';
    
    return userOrError.isSuccess ? userOrError.getValue() : null;
    
  }

  public static toPersistence (ponto: Ponto): any {
    return {
        domainID: ponto.returnIdPonto(),
        abscissa: ponto.returnAbscissa(),
        ordenada: ponto.returnOrdenada(),
        tipoPonto: ponto.returnTipoPonto()
    }
  }
}
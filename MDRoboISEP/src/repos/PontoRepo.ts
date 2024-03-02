import { Service, Inject } from 'typedi';

import IPontoRepo from "../services/IRepos/IPontoRepo";
import { Ponto } from "../domain/ponto/Ponto";
import { IdPonto } from "../domain/ponto/IdPonto";
import { PontoMap } from "../mappers/PontoMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IPontoPersistence } from '../dataschema/IPontoPersistence';

@Service()
export default class PontoRepo implements IPontoRepo {
  private models: any;

  constructor(
    @Inject('PontoSchema') private pontoSchema : Model<IPontoPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(ponto: Ponto): Promise<boolean> {
    
    const idX = ponto.id instanceof IdPonto ? (<IdPonto>ponto.id).toValue() : ponto.id;

    const query = { domainID: idX}; 
    const roleDocument = await this.pontoSchema.findOne( query as FilterQuery<IPontoPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save (ponto: Ponto): Promise<Ponto> {
    const query = { domainID: ponto.id.toString()}; 

    const pontoDocument = await this.pontoSchema.findOne( query );

    try {
      if (pontoDocument === null ) {
        const rawPonto: any = PontoMap.toPersistence(ponto);

        const pontoCreated = await this.pontoSchema.create(rawPonto);

        return PontoMap.toDomain(pontoCreated);
      } else {
        pontoDocument.id = ponto.id;
        pontoDocument.abscissa = ponto.returnAbscissa();
        pontoDocument.ordenada = ponto.returnOrdenada();
        pontoDocument.tipoPonto = ponto.returnTipoPonto();
        await pontoDocument.save();

        return ponto;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId (idPonto: IdPonto | number): Promise<Ponto> {
    const query = { domainID: idPonto};
    const pontoRecord = await this.pontoSchema.findOne( query as FilterQuery<IPontoPersistence & Document> );

    if( pontoRecord != null) {
      return PontoMap.toDomain(pontoRecord);
    }
    else
      return null;
  }

  public async getMaxId(): Promise<number> {
    try {
      var maxIdResult = await this.pontoSchema
          .find({}, { domainID: 1 })
         ;

      if (maxIdResult && maxIdResult.length > 0) {
          return (maxIdResult.sort((a, b) => b.domainID - a.domainID))[0].domainID;
      } else {
          return 0; 
      }
  } catch (err) {
      throw err;
  }
}

  public async delete(ponto: Ponto): Promise<boolean> {
    const query = { domainID: ponto.returnIdPonto()};
    const pontoDocument = await this.pontoSchema.findOne( query as FilterQuery<IPontoPersistence & Document> );
    try {
        if(pontoDocument === null) {
            return false;
        }
        else{
            await this.pontoSchema.deleteOne( query as FilterQuery<IPontoPersistence & Document> );
            return true;
        }

    } catch (error) {
        throw error;
    }
  }
}
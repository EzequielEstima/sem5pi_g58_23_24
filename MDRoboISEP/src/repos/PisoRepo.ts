import { Service, Inject } from 'typedi';

import IPisoRepo from "../services/IRepos/IPisoRepo";
import { Piso } from "../domain/piso/Piso";
import { IdPiso } from "../domain/piso/IdPiso";
import { PisoMap } from "../mappers/PisoMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IPisoPersistence } from '../dataschema/IPisoPersistence';

@Service()
export default class PisoRepo implements IPisoRepo {
  private models: any;

  constructor(
    @Inject('PisoSchema') private pisoSchema : Model<IPisoPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(piso: Piso): Promise<boolean> {
    
    const idX = piso.id instanceof IdPiso ? (<IdPiso>piso.id).toValue() : piso.id;

    const query = { domainId: idX}; 
    const roleDocument = await this.pisoSchema.findOne( query as FilterQuery<IPisoPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save (piso: Piso): Promise<Piso> {
    const query = { domainID: piso.id.toString()}; 

    const pisoDocument = await this.pisoSchema.findOne( query );

    try {
      if (pisoDocument === null ) {
        const rawPiso: any = PisoMap.toPersistence(piso);

        const pisoCreated = await this.pisoSchema.create(rawPiso);

        return PisoMap.toDomain(pisoCreated);
      } else {
        pisoDocument.id = piso.id;
        pisoDocument.numeroPiso = piso.returnNumeroPiso();
        if(piso.props.descricaoPiso !== undefined && piso.props.descricaoPiso !== null){
          pisoDocument.descricaoPiso = piso.returnDescricaoPiso();
        }
        if(piso.props.mapa !== undefined && piso.props.mapa !== null){
          pisoDocument.mapa = piso.returnIdMapa();
        }
        await pisoDocument.save();

        return piso;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId (idPiso: IdPiso | number): Promise<Piso> {
    const query = { domainID: idPiso};
    const pisoRecord = await this.pisoSchema.findOne( query as FilterQuery<IPisoPersistence & Document> );

    if( pisoRecord != null) {
      return PisoMap.toDomain(pisoRecord);
    }
    else
      return null;
  }

  public async getMaxId(): Promise<number> {
    try {
        var maxIdResult = await this.pisoSchema
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

  public async delete(piso: Piso): Promise<boolean> {
    const query = { domainID: piso.returnIdPiso()};
    const pisoDocument = await this.pisoSchema.findOne( query as FilterQuery<IPisoPersistence & Document> );
    try {
        if(pisoDocument === null) {
            return false;
        }
        else{
            await this.pisoSchema.deleteOne( query as FilterQuery<IPisoPersistence & Document> );
            return true;
        }

    } catch (error) {
        throw error;
    }
  }
}
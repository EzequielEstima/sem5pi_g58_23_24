import { Service, Inject } from 'typedi';

import IEdificioRepo from "../services/IRepos/IEdificioRepo";
import { EdificioMap } from "../mappers/EdificioMap";

import { Edificio } from "../domain/edificio/Edificio";
import { Codigo } from '../domain/edificio/Codigo';
import { Document, FilterQuery, Model } from 'mongoose';
import { IEdificioPersistence } from '../dataschema/IEdificioPersistence';
import { Piso } from '../domain/piso/Piso';

@Service()
export default class EdificioRepo implements IEdificioRepo {
  private models: any;

  constructor(
    @Inject('EdificioSchema') private edificioSchema : Model<IEdificioPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(edificio: Edificio): Promise<boolean> {
    
    const idX = edificio.id instanceof Codigo ? (<Codigo>edificio.id).toValue() : edificio.id;

    const query = { codigo: idX}; 
    const roleDocument = await this.edificioSchema.findOne( query as FilterQuery<IEdificioPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save (edificio: Edificio): Promise<Edificio> {
    const query = { codigo: edificio.id.toString()}; 

    const edificioDocument = await this.edificioSchema.findOne( query );

    try {
      if (edificioDocument === null ) {
        const rawEdificio: any = EdificioMap.toPersistence(edificio);

        const edificioCreated = await this.edificioSchema.create(rawEdificio);

        return EdificioMap.toDomain(edificioCreated);
      } else {
        edificioDocument.id = edificio.id;
        edificioDocument.dimensaoX = edificio.returnDimensaoX();
        edificioDocument.dimensaoY = edificio.returnDimensaoY();
        edificioDocument.piso = edificio.returnListaPisosId();

        if(edificio.props.nome !== undefined){
          edificioDocument.nome = edificio.returnNome();
        }
        if(edificio.props.descricao !== undefined){
          edificioDocument.descricao = edificio.returnDescricao();
        }
        if(edificio.props.elevador !== undefined){
          edificioDocument.elevador = edificio.returnElevadorId();
        }
        await edificioDocument.save();

        return edificio;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId (codigo: Codigo | string): Promise<Edificio> {
    const query = { codigo: codigo};
    const edificioRecord = await this.edificioSchema.findOne( query as FilterQuery<IEdificioPersistence & Document> );

    if( edificioRecord != null) {
      return EdificioMap.toDomain(edificioRecord);
    }
    else
      return null;
  }

  public async getAllEdificios(): Promise<Edificio[]> {
    const edificioDocuments = await this.edificioSchema.find();
    const listaEdificioPromises: Promise<Edificio>[] = [];

    for (let edificio of edificioDocuments) {
      listaEdificioPromises.push(EdificioMap.toDomain(edificio));
    }
    const listaEdificio = await Promise.all(listaEdificioPromises);
    return listaEdificio;
  }

  public async delete(edificio: Edificio): Promise<boolean> {
    const query = { codigo: edificio.id.toString()};
    const edificioDocument = await this.edificioSchema.findOne( query as FilterQuery<IEdificioPersistence & Document> );

    if(edificioDocument != null){
      await this.edificioSchema.deleteOne(query);
      return true;
    }
    else
      return false;
  }

  public async findByPiso(piso: number): Promise<Edificio> {
    const query = { piso: { $elemMatch: { $eq: piso } } };
    const edificioRecord = await this.edificioSchema.findOne( query as FilterQuery<IEdificioPersistence & Document> );
    if( edificioRecord != null) {
      return EdificioMap.toDomain(edificioRecord);
    }
    else
      return null;
  }

}
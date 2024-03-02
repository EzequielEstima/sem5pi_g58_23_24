import { Service, Inject } from 'typedi';

import IDispositivoRepo from "../services/IRepos/IDispositivoRepo";
import { Dispositivo } from "../domain/dispositivo/Dispositivo";
import { CodigoDispositivo } from "../domain/dispositivo/CodigoDispositivo";
import { DispositivoMap } from "../mappers/DispositivoMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IDispositivoPersistence } from '../dataschema/IDispositivoPersistence';
import { Nickname } from '../domain/dispositivo/Nickname';
import { NumeroDeSerie } from '../domain/dispositivo/NumeroDeSerie';

@Service()
export default class DispositivoRepo implements IDispositivoRepo {
  private models: any;

  constructor(
    @Inject('DispositivoSchema') private dispositivoSchema : Model<IDispositivoPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async save (dispositivo: Dispositivo): Promise<Dispositivo> {
    const query = { codigo: dispositivo.id.toString()}; 

    const dispositivoDocument = await this.dispositivoSchema.findOne( query );

    try {
      if (dispositivoDocument === null ) {
        const rawDispositivo: any = DispositivoMap.toPersistence(dispositivo);

        const dispositivoCreated = await this.dispositivoSchema.create(rawDispositivo);

        return DispositivoMap.toDomain(dispositivoCreated);
      } else {
        dispositivoDocument.id = dispositivo.id;
        dispositivoDocument.nickname = dispositivo.returnNickname();
        dispositivoDocument.estado = dispositivo.returnEstado();
        dispositivoDocument.numeroSerie = dispositivo.returnNumeroSerie();
        dispositivoDocument.tipoDeDispositivo = dispositivo.props.tipoDeDispositivo.returnIdTipoDispositivo();
        if (dispositivo.returnDescricaoDispositivo() !== null && dispositivo.returnDescricaoDispositivo() !== undefined) {
            dispositivoDocument.descricaoDispositivo = dispositivo.returnDescricaoDispositivo();
        }
        await dispositivoDocument.save();

        return dispositivo;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId (codigo: CodigoDispositivo | string): Promise<Dispositivo> {
    const query = { codigo: codigo.toString()};
    const dispositivoRecord = await this.dispositivoSchema.findOne( query as FilterQuery<IDispositivoPersistence & Document> );

    if( dispositivoRecord != null) {
      return DispositivoMap.toDomain(dispositivoRecord);
    }
    else
      return null;
  }

    public async findByNickname (nickname: Nickname | string): Promise<Dispositivo> {
        const query = { nickname: nickname.toString()};
        const dispositivoRecord = await this.dispositivoSchema.findOne( query as FilterQuery<IDispositivoPersistence & Document> );
    
        if( dispositivoRecord != null) {
        return DispositivoMap.toDomain(dispositivoRecord);
        }
        else
        return null;
    }

    public async exists(dispositivo: Dispositivo): Promise<boolean> {
    
    const idX = dispositivo.id instanceof CodigoDispositivo ? (<CodigoDispositivo>dispositivo.id).toValue() : dispositivo.id;

    const query = { codigo: idX}; 
    const dispositivoDocument = await this.dispositivoSchema.findOne( query as FilterQuery<IDispositivoPersistence & Document>);

    return !!dispositivoDocument === true;
  }

  public async findByNumeroSerie(numeroDeSerie: NumeroDeSerie | string): Promise<Dispositivo[]> {
    const query = { numeroSerie: numeroDeSerie.toString()};
    
    const dispositivoRecords = await this.dispositivoSchema.find(query as FilterQuery<IDispositivoPersistence & Document>);

    const listaDispositivosPromises: Promise<Dispositivo>[] = [];

    for (const dispositivo of dispositivoRecords) {
      listaDispositivosPromises.push(DispositivoMap.toDomain(dispositivo));
    }

    const listaDispositivos = await Promise.all(listaDispositivosPromises);
    return listaDispositivos;
  }

  public async findAll(): Promise<Dispositivo[]> {
    const dispositivoRecords = await this.dispositivoSchema.find();

    const listaDispositivosPromises: Promise<Dispositivo>[] = [];

    for (const dispositivo of dispositivoRecords) {
      listaDispositivosPromises.push(DispositivoMap.toDomain(dispositivo));
    }

    const listaDispositivos = await Promise.all(listaDispositivosPromises);
    return listaDispositivos;
  }

  public async delete(dispositivo: Dispositivo): Promise<boolean> {
  
    const query = { codigo: dispositivo.returnCodigoDispositivo()}; 
    const dispositivoDocument = await this.dispositivoSchema.findOne( query as FilterQuery<IDispositivoPersistence & Document>);

    if( dispositivoDocument != null) {
      await this.dispositivoSchema.deleteOne( query as FilterQuery<IDispositivoPersistence & Document> );
      return true;
    }
    else
      return false;
  }

  public async listarTodosOsDispositivosDeUmTipo(tipoDeDispositivo: number): Promise<Dispositivo[]> {
    const query = { tipoDeDispositivo: tipoDeDispositivo};
    
    const dispositivoRecords = await this.dispositivoSchema.find(query as FilterQuery<IDispositivoPersistence & Document>);

    const listaDispositivosPromises: Promise<Dispositivo>[] = [];

    for (const dispositivo of dispositivoRecords) {
      listaDispositivosPromises.push(DispositivoMap.toDomain(dispositivo));
    }

    const listaDispositivos = await Promise.all(listaDispositivosPromises);
    return listaDispositivos;
  }

}

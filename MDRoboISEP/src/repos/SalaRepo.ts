import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';

import { forEach } from 'lodash';
import NomeSala from '../domain/sala/NomeSala';
import { Sala } from '../domain/sala/Sala';
import { ISalaPersistence } from '../dataschema/ISalaPersistence';
import { SalaMap } from '../mappers/SalaMap';
import ISalaRepo from '../services/IRepos/ISalaRepo';
import { off } from 'process';

@Service()
export default class SalaRepo implements ISalaRepo {
  private models: any;

  constructor(
    @Inject('SalaSchema') private salaSchema: Model<ISalaPersistence & Document>,
  ) { }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(sala: Sala): Promise<boolean> {

    const idX = sala.id instanceof NomeSala ? (<NomeSala>sala.id).toValue() : sala.id;

    const query = { domainID: idX };
    const roleDocument = await this.salaSchema.findOne(query as FilterQuery<ISalaPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save(sala: Sala): Promise<Sala> {

    const id = sala.id.toString();
    const query = { domainID: id };

    const salaDocument = await this.salaSchema.findOne(query);

    try {
      if (salaDocument === null) {
        const rawSala: any = SalaMap.toPersistence(sala);

        const salaCreated = await this.salaSchema.create(rawSala);

        return SalaMap.toDomain(salaCreated);
      } else {
        salaDocument.id = sala.id;
        await salaDocument.save();

        return sala;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(idSala: NomeSala | string): Promise<Sala> {
    const query = { domainID: idSala };
    const salaRecord = await this.salaSchema.findOne(query as FilterQuery<ISalaPersistence & Document>);

    if (salaRecord != null) {
      return SalaMap.toDomain(salaRecord);
    }
    else
      return null;
  }

  public async delete(sala: Sala): Promise<boolean> {
    const query = { domainID: sala.id.toString() };
    const salaRecord = await this.salaSchema.findOne(query as FilterQuery<ISalaPersistence & Document>);

    if (salaRecord != null) {
      await this.salaSchema.deleteOne(query as FilterQuery<ISalaPersistence & Document>);
      return true;
    }
    else
      return false;
  }

  public async findSalasByPiso(idPiso: number): Promise<Sala[]> {
    const query = { piso: idPiso };
    const salaRecord = await this.salaSchema.find(query as FilterQuery<ISalaPersistence & Document>);
    let listaSalas = [];
    for(let sala of salaRecord){
      listaSalas.push(SalaMap.toDomain(sala));
    }
    return await Promise.all(listaSalas);
  }

}
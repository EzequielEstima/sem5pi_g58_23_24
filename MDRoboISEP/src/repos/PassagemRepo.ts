import { Service, Inject } from 'typedi';

import IPassagemRepo from "../services/IRepos/IPassagemRepo";

import { Passagem } from "../domain/passagem/Passagem";
import { Document, FilterQuery, Model } from 'mongoose';
import { IPassagemPersistence } from '../dataschema/IPassagemPersistence';
import { PassagemMap } from '../mappers/PassagemMap';
import { IdPassagem } from '../domain/passagem/IdPassagem';
import { forEach } from 'lodash';

@Service()
export default class PassagemRepo implements IPassagemRepo {
  private models: any;

  constructor(
    @Inject('PassagemSchema') private passagemSchema: Model<IPassagemPersistence & Document>,
  ) { }

  async getMaxId(): Promise<number> {
    try {
      var maxIdResult = await this.passagemSchema
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

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(passagem: Passagem): Promise<boolean> {

    const idX = passagem.id instanceof IdPassagem ? (<IdPassagem>passagem.id).toValue() : passagem.id;

    const query = { domainID: idX };
    const roleDocument = await this.passagemSchema.findOne(query as FilterQuery<IPassagemPersistence & Document>);

    return !!roleDocument === true;
  }

  public async save(passagem: Passagem): Promise<Passagem> {

    const id = passagem.id.toString();
    const query = { domainID: id };

    const passagemDocument = await this.passagemSchema.findOne(query);

    try {
      if (passagemDocument === null) {
        const rawPassagem: any = PassagemMap.toPersistence(passagem);

        const passagemCreated = await this.passagemSchema.create(rawPassagem);

        return PassagemMap.toDomain(passagemCreated);
      } else {
        passagemDocument.domainID = Number(passagem.id.toValue());
        passagemDocument.pisoA = Number(passagem.props.pisoA.id.toValue());
        passagemDocument.pisoB = Number(passagem.props.pisoB.id.toValue());
        await passagemDocument.save();
        return passagem;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(idPassagem: IdPassagem | number): Promise<Passagem> {
    const query = { domainID: idPassagem.toString() };
    const passagemRecord = await this.passagemSchema.findOne(query as FilterQuery<IPassagemPersistence & Document>);

    if (passagemRecord != null) {
      return PassagemMap.toDomain(passagemRecord);
    }
    else
      return null;
  }

  public async delete(passagem: Passagem): Promise<boolean> {
    const query = { domainID: passagem.id.toString() };
    const salaRecord = await this.passagemSchema.findOne(query as FilterQuery<IPassagemPersistence & Document>);

    if (salaRecord != null) {
      await this.passagemSchema.deleteOne(query as FilterQuery<IPassagemPersistence & Document>);
      return true;
    } else {
      return false;
    }
  }

  public async findAll(): Promise<Passagem[]> {
    const passagemRecords = await this.passagemSchema.find();

    const listaPassagensPromises: Promise<Passagem>[] = [];

    for (const passagem of passagemRecords) {
      listaPassagensPromises.push(PassagemMap.toDomain(passagem));
    }

    const listaPassagens = await Promise.all(listaPassagensPromises);
    return listaPassagens;
  }

  public async listarPassagensComUmPiso(id: number): Promise<Passagem[]> {
    const query = { pisoA: id };
    const passagemRecord1 = await this.passagemSchema.find(query as FilterQuery<IPassagemPersistence & Document>);

    var listaPassagens = [];
    for (let passagem of passagemRecord1) {
      listaPassagens.push(PassagemMap.toDomain(passagem));
    }
    const query2 = { pisoB: id };
    const passagemRecord2 = await this.passagemSchema.find(query2 as FilterQuery<IPassagemPersistence & Document>);
    for (let passagem of passagemRecord2) {
      listaPassagens.push(PassagemMap.toDomain(passagem));
    }

    return await Promise.all(listaPassagens);
  }

  public async listarPassagensPorParDePisos(idPisoA: number, idPisoB: number): Promise<Passagem[]> {
    const query = { pisoA: idPisoA, pisoB: idPisoB };
    const passagemRecord1 = await this.passagemSchema.find(query as FilterQuery<IPassagemPersistence & Document>);

    var listaPassagens = [];
    for (let passagem of passagemRecord1) {
      listaPassagens.push(PassagemMap.toDomain(passagem));
    }
    const query2 = { pisoA: idPisoB, pisoB: idPisoA };
    const passagemRecord2 = await this.passagemSchema.find(query2 as FilterQuery<IPassagemPersistence & Document>);
    for (let passagem of passagemRecord2) {
      listaPassagens.push(PassagemMap.toDomain(passagem));
    }

    return listaPassagens;
  }
}
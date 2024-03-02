import { Inject, Service } from "typedi";
import IElevadorRepo from "../services/IRepos/IElevadorRepo";
import { Elevador } from "../domain/elevador/Elevador";
import { IdElevador } from "../domain/elevador/IdElevador";
import { FilterQuery, Model } from "mongoose";
import { IElevadorPersistence } from "../dataschema/IElevadorPersistence";
import { Document } from "mongodb";
import { ElevadorMap } from "../mappers/ElevadorMap";

@Service()
export default class ElevadorRepo implements IElevadorRepo{
    private models: any;

    constructor(
        @Inject('ElevadorSchema')
        private elevadorSchema : Model<IElevadorPersistence & Document>,
    ){}
    
    private createBaseQuery (): any {
        return {
          where: {},
        }
    }

    public async exists(elevador: Elevador): Promise<boolean>{
        const idX = elevador.id instanceof IdElevador ? (<IdElevador>elevador.id).toValue() : elevador.id;
        const query = {domainId: idX};
        const elevadorDocument = await this.elevadorSchema.findOne( query as FilterQuery<IElevadorPersistence & Document>);
        
        return !!elevadorDocument === true;
        
    }

    public async save(elevador: Elevador): Promise<Elevador>{
        const query = { domainId: elevador.id.toString()}; 

        const elevadorDocument = await this.elevadorSchema.findOne(query);

        try{
            if (elevadorDocument === null){
                const rawElevador: any = ElevadorMap.toPersistence(elevador)

                const elevadorCreated = await this.elevadorSchema.create(rawElevador);

                return ElevadorMap.toDomain(elevadorCreated);
            }else{
                elevadorDocument.id = elevador.id;
                elevadorDocument.pisosServidos = elevador.returnIdPisosServidos();
                elevadorDocument.marca = elevador.returnMarca();
                elevadorDocument.modelo = elevador.returnModelo();
                elevadorDocument.numeroSerie = elevador.returnNumeroSerie();
                elevadorDocument.descricao = elevador.returnDescricao();
                await elevadorDocument.save();
                return elevador;
            }
        }catch (err){
            throw err;
        }
    }

    public async findByDomainId(idElevador: IdElevador | number): Promise<Elevador>{
        const query = {domainId: idElevador};
        const elevadorRecord = await this.elevadorSchema.findOne( query as FilterQuery<IElevadorPersistence & Document>);

        if (elevadorRecord != null){
            return ElevadorMap.toDomain(elevadorRecord);
        }else{
            return null;
        }
    }

    public async getMaxId(): Promise<number> {
        try {
            var maxIdResult = await this.elevadorSchema
                .find({}, { domainId: 1 })
               ;
    
            if (maxIdResult && maxIdResult.length > 0) {
                return (maxIdResult.sort((a, b) => b.domainId - a.domainId))[0].domainId;
            } else {
                return 0; 
            }
        } catch (err) {
            throw err;
        }
    }

    public async delete(elevador: Elevador): Promise<boolean>{
        const query = { domainId: elevador.returnIdElevador()};
        const elevadorDocument = await this.elevadorSchema.findOne( query as FilterQuery<IElevadorPersistence & Document> );
        if (elevadorDocument){
            await this.elevadorSchema.deleteOne(query);
            return true;
        }else{
            return false;
        }
    }
}
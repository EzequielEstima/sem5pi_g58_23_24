import { Inject, Service } from "typedi";
import { FilterQuery, Model } from "mongoose";
import { IElevadorPersistence } from "../dataschema/IElevadorPersistence";
import { Document } from "mongodb";
import { MapaMap } from "../mappers/MapaMap";
import IMapaRepo from "../services/IRepos/IMapaRepo";
import { IMapaPersistence } from "../dataschema/IMapaPersistence";
import { Mapa } from "../domain/mapa/Mapa";
import { IdMapa } from "../domain/mapa/IdMapa";

@Service()
export default class MapaRepo implements IMapaRepo{
    private models: any;

    constructor(
        @Inject('MapaSchema')
        private mapaSchema : Model<IMapaPersistence & Document>,
    ){}
    
    private createBaseQuery (): any {
        return {
          where: {},
        }
    }

    public async exists(mapa: Mapa): Promise<boolean>{
        const idX = mapa.id instanceof IdMapa ? (<IdMapa>mapa.id).toValue() : mapa.id;
        const query = {idMapa: idX};
        const mapaDocument = await this.mapaSchema.findOne( query as FilterQuery<IElevadorPersistence & Document>);
        
        return !!mapaDocument === true;
        
    }

    public async save(mapa: Mapa): Promise<Mapa>{
        const query = { idMapa: mapa.id.toString()}; 

        const mapaDocument = await this.mapaSchema.findOne(query);

        try{
            if (mapaDocument === null){
                const rawMapa: any = MapaMap.toPersistence(mapa)

                const mapaCreated = await this.mapaSchema.create(rawMapa);

                return MapaMap.toDomain(mapaCreated);
            }else{
                mapaDocument.id = mapa.id;
                mapaDocument.mapa = mapa.returnIdMapa();
                mapaDocument.idPassagem = mapa.returnIdPassagem();
                mapaDocument.abcissaSupPassagem = mapa.returnAbcissaSupPassagem();
                mapaDocument.ordenadaSupPassagem = mapa.returnOrdenadaSupPassagem();
                mapaDocument.abcissaInfPassagem = mapa.returnAbcissaInfPassagem();
                mapaDocument.ordenadaInfPassagem = mapa.returnOrdenadaInfPassagem();
                mapaDocument.orientacaoPassagem = mapa.returnOrientacaoPassagem();
                mapaDocument.xCoordElevador = mapa.returnXCoordElevador();
                mapaDocument.yCoordElevador = mapa.returnYCoordElevador();
                mapaDocument.orientacaoElevador = mapa.returnOrientacaoElevador();
                mapaDocument.nomeSala = mapa.returnNomeSala();
                mapaDocument.abcissaASala = mapa.returnAbcissaASala();
                mapaDocument.ordenadaASala = mapa.returnOrdenadaASala();
                mapaDocument.abcissaBSala = mapa.returnAbcissaBSala();
                mapaDocument.ordenadaBSala = mapa.returnOrdenadaBSala();
                mapaDocument.abcissaPorta = mapa.returnAbcissaPortaSala();
                mapaDocument.ordenadaPorta = mapa.returnOrdenadaPortaSala();
                mapaDocument.orientacaoPorta = mapa.returnOrientacaoPortaSala();
                await mapaDocument.save();
                return mapa;
            }
        }catch (err){
            throw err;
        }
    }

    public async findByDomainId(idMapa: IdMapa | number): Promise<Mapa>{
        const query = {idMapa: idMapa};
        const mapaRecord = await this.mapaSchema.findOne( query as FilterQuery<IElevadorPersistence & Document>);

        if (mapaRecord != null){
            return MapaMap.toDomain(mapaRecord);
        }else{
            return null;
        }
    }

    public async getMaxId(): Promise<number> {
        try {
            var maxIdResult = await this.mapaSchema
                .find({}, { idMapa: 1 })
               ;
    
            if (maxIdResult && maxIdResult.length > 0) {
                return (maxIdResult.sort((a, b) => b.idMapa - a.idMapa))[0].idMapa;
            } else {
                return 0; 
            }
        } catch (err) {
            throw err;
        }
    }

    public async delete(mapa: Mapa): Promise<boolean>{
        const query = { idMapa: mapa.returnIdMapa()};
        const mapaDocument = await this.mapaSchema.findOne( query as FilterQuery<IElevadorPersistence & Document> );
        if (mapaDocument){
            await this.mapaSchema.deleteOne(query);
            return true;
        }else{
            return false;
        }
    }
}
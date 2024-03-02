import { Repo } from "../../core/infra/Repo";
import { Mapa } from "../../domain/mapa/Mapa";
import { IdMapa } from "../../domain/mapa/IdMapa";

export default interface IMapaRepo extends Repo<Mapa>{
    save(mapa: Mapa): Promise<Mapa>;
    findByDomainId(idMapa: IdMapa | number): Promise<Mapa>;
    getMaxId(): Promise<number>;
    delete(mapa: Mapa): Promise<boolean>;
}
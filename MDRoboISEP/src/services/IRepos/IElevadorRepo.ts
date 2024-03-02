import { Repo } from "../../core/infra/Repo";
import { Elevador } from "../../domain/elevador/Elevador";
import { IdElevador } from "../../domain/elevador/IdElevador";

export default interface IElevadorRepo extends Repo<Elevador>{
    save(elevador: Elevador): Promise<Elevador>;
    findByDomainId(idElevador: IdElevador | number): Promise<Elevador>;
    getMaxId(): Promise<number>;
    delete(elevador: Elevador): Promise<boolean>;
}
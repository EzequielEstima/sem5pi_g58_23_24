import { Repo } from "../../core/infra/Repo";
import { Piso } from "../../domain/piso/Piso";
import { IdPiso } from "../../domain/piso/IdPiso";

export default interface IPisoRepo extends Repo<Piso> {
  save(piso: Piso): Promise<Piso>;
  findByDomainId (idPiso: IdPiso | number): Promise<Piso>;
  getMaxId(): Promise<number>
  delete(piso: Piso): Promise<boolean>  
}
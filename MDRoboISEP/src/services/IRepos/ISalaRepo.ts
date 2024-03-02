import { Repo } from "../../core/infra/Repo";
import { IdPiso } from "../../domain/piso/IdPiso";
import { Sala } from "../../domain/sala/Sala";

export default interface ISalaRepo extends Repo<Sala> {
  findByDomainId(id: string): Promise<Sala>;
  save(passagem: Sala): Promise<Sala>;
  delete(sala: Sala): Promise<boolean>;
  findSalasByPiso(idPiso: number): Promise<Sala[]>;
}
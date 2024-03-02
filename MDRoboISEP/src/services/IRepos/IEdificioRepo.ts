import { Repo } from "../../core/infra/Repo";
import { Edificio } from "../../domain/edificio/Edificio";
import { Codigo } from "../../domain/edificio/Codigo";
import { Piso } from "../../domain/piso/Piso";

export default interface IEdificioRepo extends Repo<Edificio> {
  findByPiso(piso: number): Promise<Edificio>;
  save(edificio: Edificio): Promise<Edificio>;
  findByDomainId (codigo: Codigo | string): Promise<Edificio>;
  getAllEdificios(): Promise<Edificio[]>;
  delete(edificio: Edificio): Promise<boolean>;
}
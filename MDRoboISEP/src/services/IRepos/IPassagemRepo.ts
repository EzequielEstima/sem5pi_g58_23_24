import { Repo } from "../../core/infra/Repo";
import { Passagem } from "../../domain/passagem/Passagem";

export default interface IPassagemRepo extends Repo<Passagem> {
  getMaxId(): Promise<number>;
  findByDomainId(id: number): Promise<Passagem>;
  save(passagem: Passagem): Promise<Passagem>;
  delete(passagem: Passagem): Promise<boolean>;
  findAll(): Promise<Passagem[]>;
  listarPassagensComUmPiso(id: number): Promise<Passagem[]>;

  /**
   * Dado um par de pisos, retorna todas as passagens que ligam esses dois pisos
   * @param idPisoA id do piso A
   * @param idPisoB id do piso B
   */
  listarPassagensPorParDePisos(idPisoA: number, idPisoB: number): Promise<Passagem[]>
}
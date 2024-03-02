import { Ponto } from "../domain/ponto/Ponto";

export default interface IPassagemDTO {
    id: number
    codigoEdificioA: string;
    codigoEdificioB: string;
    numeroPisoA: number;
    numeroPisoB: number;
}
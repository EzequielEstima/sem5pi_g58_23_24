import { Result } from "../../core/logic/Result";
import ISalaDTO from "../../dto/ISalaDTO";

export default interface ISalaService  {
    criarSala(salaDTO: ISalaDTO): Promise<Result<ISalaDTO>>;
}

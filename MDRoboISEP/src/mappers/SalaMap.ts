import { Mapper } from "../core/infra/Mapper";
import { Container } from 'typedi';
import { Ponto } from "../domain/ponto/Ponto";
import PontoRepo from "../repos/PontoRepo";

import { Sala } from "../domain/sala/Sala";
import { ISalaPersistence } from "../dataschema/ISalaPersistence";
import NomeSala from "../domain/sala/NomeSala";
import DescricaoSala from "../domain/sala/DescricaoSala";
import CategorizacaoSala from "../domain/sala/CategorizacaoSala";
import ISalaDTO from "../dto/ISalaDTO";
import { Piso } from "../domain/piso/Piso";
import PisoRepo from "../repos/PisoRepo";


export class SalaMap extends Mapper<Sala> {

    public static toDTO(sala: Sala): ISalaDTO {
        //Not implemented yet
        //return error
        return null;
    }

    public static async toDomain(raw: any): Promise<Sala> {
        //criar lista de pontos

        if (raw instanceof Sala) {
            return raw;
        }

        let maxiD = raw.domainID;
        let id = NomeSala.create(maxiD).getValue();
        let categoria: CategorizacaoSala;
        let descricao: DescricaoSala;
        let piso: Piso;

        if (raw.categoria === null || raw.categoria === undefined) {
            return null;
        }
        if (raw.categoria instanceof CategorizacaoSala && raw.descricao instanceof DescricaoSala && raw.piso instanceof Piso) {
            categoria = raw.categoria;
            descricao = raw.descricao;
            piso = raw.piso;
        } else {
            let categoriaSala = String(raw.categoria);
            let descricaoSala = String(raw.descricao);
            let pisoSala = Number(raw.piso);

            piso = await Container.get(PisoRepo).findByDomainId(pisoSala);
            categoria = CategorizacaoSala.create(categoriaSala).getValue();
            descricao = DescricaoSala.create(descricaoSala).getValue();
        }
        const salaOrError = Sala.create({
            categoria: categoria,
            descricao: descricao,
            piso: piso,
        }, id);

        return salaOrError.isSuccess ? salaOrError.getValue() : null;
    }

    public static toPersistence(sala: Sala): any {

        let dadosSala = {
            domainID: sala.id.toValue(),
            categoria: sala.props.categoria.props.categorizacao,
            descricao: sala.props.descricao.props.descricao,
            piso: sala.props.piso.returnIdPiso()
        } as unknown as ISalaPersistence

        return dadosSala;
    }
}
import Container from "typedi";
import { Mapper } from "../core/infra/Mapper";
import { DescricaoEdificio } from "../domain/edificio/DescricaoEdificio";
import { Elevador } from "../domain/elevador/Elevador";
import { MarcaElevador } from "../domain/elevador/MarcaElevador";
import { ModeloElevador } from "../domain/elevador/ModeloElevador";
import { NumeroSerieElevador } from "../domain/elevador/NumeroSerieElevador";
import { Piso } from "../domain/piso/Piso";
import IElevadorDTO from "../dto/IElevadorDTO";
import PisoRepo from "../repos/PisoRepo";
import PontoRepo from "../repos/PontoRepo";
import { IdElevador } from "../domain/elevador/IdElevador";
import { Ponto } from "../domain/ponto/Ponto";

export class ElevadorMap extends Mapper<Elevador>{
    public static toDTO(elevador: Elevador): IElevadorDTO {
        let dadosElevador: any = {
            id: elevador.id.toValue()
        }

        if (elevador.props.marca !== undefined && elevador.props.marca !== null) {
            dadosElevador.marca = elevador.returnMarca();
        }

        if (elevador.props.modelo !== undefined && elevador.props.modelo !== null) {
            dadosElevador.modelo = elevador.returnModelo();
        }

        if (elevador.props.numeroSerie !== undefined && elevador.props.numeroSerie !== null) {
            dadosElevador.numeroSerie = elevador.returnNumeroSerie();
        }

        if (elevador.props.descricao !== undefined && elevador.props.descricao !== null) {
            dadosElevador.descricao = elevador.returnDescricao();
        }
        return dadosElevador as IElevadorDTO;
    }

    public static async toDomain (raw: any): Promise<Elevador>{
        
        let dadosElevador : any = {};
        
        const pisoRepo = Container.get(PisoRepo);
        const pontoRepo = Container.get(PontoRepo);
        
        const idElevador = IdElevador.create(raw.domainId); 
        let pisosServido: Piso[] = [];
        for (let i = 0; i< raw.pisosServidos.length; i++){
            pisosServido[i] = await pisoRepo.findByDomainId(raw.pisosServidos[i]);
        }

        dadosElevador.pisosServidos = pisosServido;

        if(raw.marca !== null && raw.marca !== undefined){
            const marcaOrError = MarcaElevador.create(raw.marca);     
            dadosElevador.marca = marcaOrError.getValue();
        }
        if(raw.modelo !== null && raw.modelo !== undefined){
            const modeloOrError = ModeloElevador.create(raw.modelo);
            dadosElevador.modelo = modeloOrError.getValue();
        }
        if(raw.numeroSerie !== null && raw.numeroSerie !== undefined){
            const numeroSerieOrError = NumeroSerieElevador.create(raw.numeroSerie);
            dadosElevador.numeroSerie = numeroSerieOrError.getValue();
        }
        if(raw.descricao !== null && raw.descricao !== undefined){
            const descricaoOrError = DescricaoEdificio.create(raw.descricao);
            dadosElevador.descricao = descricaoOrError.getValue();
        }
        
        
        const elevadorOrError = Elevador.create(dadosElevador,idElevador.getValue());

        elevadorOrError.isFailure ? console.log(elevadorOrError.error) : '';

        return elevadorOrError.isSuccess ? elevadorOrError.getValue() : null;
    }

    public static toPersistence (elevador: Elevador): any {
        
        let dadosElevador : any ={
            domainId: elevador.returnIdElevador(),
            pisosServidos: elevador.returnIdPisosServidos(),
        }
        
        if(elevador.props.marca !== undefined && elevador.props.marca !== null){
            dadosElevador.marca = elevador.returnMarca();
        }
        if(elevador.props.modelo !== undefined && elevador.props.modelo !== null){
            dadosElevador.modelo = elevador.returnModelo();
        }
        if(elevador.props.numeroSerie !== undefined && elevador.props.numeroSerie !== null){
            dadosElevador.numeroSerie = elevador.returnNumeroSerie();
        }
        if(elevador.props.descricao !== undefined && elevador.props.descricao !== null){
            dadosElevador.descricao = elevador.returnDescricao();
        }

        return dadosElevador;

    }
}
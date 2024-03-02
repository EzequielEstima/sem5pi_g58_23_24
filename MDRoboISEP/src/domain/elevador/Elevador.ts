import { Model } from "mongoose";
import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { Piso } from "../piso/Piso";
import { Ponto } from "../ponto/Ponto";
import { DescricaoElevador } from "./DescricaoElevador";
import { IdElevador } from "./IdElevador";
import { MarcaElevador } from "./MarcaElevador";
import { ModeloElevador } from "./ModeloElevador";
import { NumeroSerieElevador } from "./NumeroSerieElevador";

interface ElevadorProps{
    pisosServidos: Piso[];
    marca: MarcaElevador;
    modelo: ModeloElevador;
    numeroSerie: NumeroSerieElevador;
    descricao: DescricaoElevador;
}

export class Elevador extends AggregateRoot<ElevadorProps>{
    private constructor (props: ElevadorProps, id: IdElevador){
        super(props,id);
    }

    public static create (props: ElevadorProps, id: IdElevador) : Result<Elevador> {

        const guardedProps = [
            {argument: props.pisosServidos, argumentName: 'Lista de pisos servidos' },
        ]

        let guardResults : any[] = [];
        // Tem de ter o array pisos servidos
        guardResults.push(Guard.againstNullOrUndefined(guardedProps[0].argument,guardedProps[0].argumentName));
        // Tem de ter mais que um piso servido
        guardResults.push(Guard.arrayHasGreaterLengthThan(guardedProps[0].argument,1,guardedProps[0].argumentName));
    
        const finalGuard = Guard.combine(guardResults);

        if (!finalGuard.succeeded) {
            return Result.fail<Elevador>(finalGuard.message)
        }     
        else {
            const elevador = new Elevador({
                ...props
            }, id);

            return Result.ok<Elevador>(elevador);
        }
    }
    public returnIdElevador() : number{
        return Number(this._id.toValue());
    }
    public returnIdPisosServidos() : number[]{
        let ids: number[] = [];
        for (let i = 0; i < this.props.pisosServidos.length; i++){
            ids[i] = Number(this.props.pisosServidos[i].id.toValue())
        }
        return ids;
    }
    public returnMarca() : string{
        return this.props.marca.props.marca;
    }
    public returnModelo() : string{
        return this.props.modelo.props.modelo;
    }
    public returnNumeroSerie() : string{
        return this.props.numeroSerie.props.numeroSerie;
    }
    public returnDescricao(): string {
        return this.props.descricao.props.descricao;
    }
    
    public pisosServidosAtuais() : Piso[]{
        return this.props.pisosServidos;
    }
    
    public pisoServidosComMapa(){
        let pisos: Piso[] = [];
        for (let piso of this.props.pisosServidos){
            if (piso.hasMapa()){
                pisos.push(piso);
            }
        }
        return pisos;
    }

    public updatePisos(novosPisos: Piso[]){
        this.props.pisosServidos = novosPisos;
    }

    public updateMarca(novaMarca: MarcaElevador){
        this.props.marca = novaMarca;
    }

    public updateModelo(novoModelo: ModeloElevador){
        this.props.modelo = novoModelo;
    }

    public updateNumeroSerie(novoNumeroSerie: NumeroSerieElevador){
        this.props.numeroSerie = novoNumeroSerie;
    }

    public updateDescricao(novoDescricao: DescricaoElevador){
        this.props.descricao = novoDescricao;
    }
}
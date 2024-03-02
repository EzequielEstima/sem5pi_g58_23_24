import { Mapper } from "../core/infra/Mapper";
import IEdificioDTO from "../dto/IEdificioDTO";
import { Edificio } from "../domain/edificio/Edificio";
import {Piso} from '../domain/piso/Piso';
import PisoRepo from "../repos/PisoRepo";
import Container from "typedi";
import { Nome } from "../domain/edificio/Nome";
import { Dimensao } from "../domain/edificio/Dimensao";
import { DescricaoEdificio } from "../domain/edificio/DescricaoEdificio";
import { Codigo } from "../domain/edificio/Codigo";
import { Elevador } from "../domain/elevador/Elevador";
import ElevadorRepo from "../repos/ElevadorRepo";

export class EdificioMap extends Mapper<Edificio> {
  
  public static toDTO(edificio: Edificio): IEdificioDTO {
    let dadosEdificio : any = {
      codigo : edificio.returnEdificioId().toString(),
      dimensaoX: edificio.returnDimensaoX(),
      dimensaoY:edificio.returnDimensaoY(),
    }
    
    if(edificio.props.descricao !== undefined){
      dadosEdificio.descricao = edificio.returnDescricao();
    }
    if(edificio.props.nome !== undefined){
      dadosEdificio.nome = edificio.returnNome();
    }
    return dadosEdificio as IEdificioDTO;
    
  }

  public static async toDomain (raw: any): Promise<Edificio> {
    let listaPiso: Piso[] = [];
    let pisoRepo = Container.get(PisoRepo);
    let elevadorRepo = Container.get(ElevadorRepo);

    const dimensaoOrError = Dimensao.create(raw.dimensaoX,raw.dimensaoY);
    const codigoOrError = Codigo.create(raw.codigo);
    if(dimensaoOrError.isFailure || codigoOrError.isFailure){
      return null;
    }
    const dadosEdificio : any = {
      dimensao:dimensaoOrError.getValue(),
      listaPisos:listaPiso,
    }
    
    if(raw.nome){
      const nomeOrError = Nome.create(raw.nome);
      dadosEdificio.nome = nomeOrError.getValue();
    }
    if(raw.descricao){
      const descricaoOrError = DescricaoEdificio.create(raw.descricao);
      dadosEdificio.descricao = descricaoOrError.getValue();
    }
    if(raw.elevador){
      const elevador = await elevadorRepo.findByDomainId(raw.elevador);
      dadosEdificio.elevador = elevador;
    }

    for(let i= 0; i<raw.piso.length; i++){
      listaPiso[i] = await pisoRepo.findByDomainId(raw.piso[i]);
    }
    
    const edificioOrError = Edificio.create(dadosEdificio,codigoOrError.getValue());

    edificioOrError.isFailure ? console.log(edificioOrError.error) : '';
    
    return edificioOrError.isSuccess ? edificioOrError.getValue() : null;

  }

  public static toPersistence (edificio: Edificio): any {
    let dadosEdificio : any = {
      codigo : edificio.returnEdificioId(),
      dimensaoX: edificio.returnDimensaoX(),
      dimensaoY:edificio.returnDimensaoY(),
      piso : edificio.returnListaPisosId(),        
    }

    if(edificio.props.elevador !== undefined){
      dadosEdificio.elevador = edificio.returnElevadorId();
    }
    if(edificio.props.descricao !== undefined){
      dadosEdificio.descricao = edificio.returnDescricao();
    }
    if(edificio.props.nome !== undefined){
      dadosEdificio.nome = edificio.returnNome();
    }
    return dadosEdificio;
  }
}
import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { Ponto } from "../ponto/Ponto";
import { CodigoDispositivo } from "./CodigoDispositivo";
import { DescricaoDispositivo } from "./DescricaoDispositivo";
import { EstadoDispositivo } from "./EstadoDispositivo";
import { Nickname } from "./Nickname";
import { NumeroDeSerie } from "./NumeroDeSerie";
import { TipoDispositivo } from "../tipoDispositivo/TipoDispositivo";


interface dispositivoProps {
  descricaoDispositivo: DescricaoDispositivo;
  estado: EstadoDispositivo;
  nickname: Nickname;
  numeroSerie: NumeroDeSerie;
  tipoDeDispositivo: TipoDispositivo;
}

export class Dispositivo extends AggregateRoot<dispositivoProps> {
  inibirDispositivo() {
    this.props.estado = EstadoDispositivo.create(false).getValue();
  }

  public returnDescricaoDispositivo (): string {
    return this.props.descricaoDispositivo.props.descricao;
  }
  public returnEstado (): boolean {
    return this.props.estado.props.estado;
  }
  public returnNickname (): string {
    return this.props.nickname.props.nickname;
  }
  public returnNumeroSerie (): string {
    return this.props.numeroSerie.props.numeroSerie;
  }
  public returnCodigoDispositivo (): string {
    return this.id.toString();
  }

  public numeroDeSerieIgual (numeroSerie: string): boolean {
    return this.props.numeroSerie.props.numeroSerie === numeroSerie;
  }

  public returnTipoDispositivoModelo (): string {
    return this.props.tipoDeDispositivo.returnModelo();
  }

  public returnTipoDispositivoMarca (): string {
    return this.props.tipoDeDispositivo.returnMarca();
  }


  private constructor (props : dispositivoProps, id?: CodigoDispositivo) {
      super(props,id);
  }

  public static create (props: dispositivoProps, id: CodigoDispositivo): Result<Dispositivo> {

    const guardedProps = [
      { argument: props.descricaoDispositivo, argumentName: 'descricaoDispositivo' },
      { argument: props.estado, argumentName: 'estado' },
      { argument: props.nickname, argumentName: 'nickname' },
      { argument: props.numeroSerie, argumentName: 'numeroSerie' },
    ];

    let guard1 = Guard.againstNullOrUndefined(guardedProps[1].argument,guardedProps[1].argumentName);
    let guard2 = Guard.againstNullOrUndefined(guardedProps[2].argument,guardedProps[2].argumentName);
    let guard3 = Guard.againstNullOrUndefined(guardedProps[3].argument,guardedProps[3].argumentName);
    let guard4 = Guard.againstNullOrUndefined(id, 'Codigo do Dispositivo');

    let guardResult = Guard.combine([guard1,guard2,guard3,guard4]);

    if (!guardResult.succeeded) {
      return Result.fail<Dispositivo>(guardResult.message)
    }     
    else {
      const piso = new Dispositivo({
        ...props
      }, id);

      return Result.ok<Dispositivo>(piso);
    }
  }
}
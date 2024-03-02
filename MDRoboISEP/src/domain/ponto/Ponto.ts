import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Result } from "../../core/logic/Result";
import { Coordenadas } from "./Coordenadas";
import { TipoPonto } from "./TipoPonto";
import { IdPonto } from "./IdPonto";
import { Guard } from "../../core/logic/Guard";


interface pontoProps {
  coordenadas: Coordenadas;
  tipoPonto: TipoPonto;
}

export class Ponto extends AggregateRoot<pontoProps> {

  public returnIdPonto() : number{
    return Number(this._id.toValue());
  }
  
  public returnAbscissa() : number{
    return this.props.coordenadas.props.abscissa;
  }

  public returnOrdenada() : number{
    return this.props.coordenadas.props.ordenada;
  }

  public returnTipoPonto() : string{
    return this.props.tipoPonto.props.tipoPonto;
  }

 

  private constructor (props : pontoProps, id?: IdPonto) {
      super(props,id)
  }

  public static create (props: pontoProps, id?: IdPonto): Result<Ponto> {

    const guardedProps = [
      { argument: props.coordenadas, argumentName: 'coordenadas' },
      { argument: props.tipoPonto, argumentName: 'tipoPonto' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Ponto>(guardResult.message)
    }     
    else {
      const piso = new Ponto({
        ...props
      }, id);

      return Result.ok<Ponto>(piso);
    }
  }

  public toElevador() {
    this.props.tipoPonto = TipoPonto.create("Elevador").getValue();
  }

  public toParedeNorteOeste() {
    this.props.tipoPonto = TipoPonto.create("NorteOeste").getValue();
  }

  public toParedeNorte() {
    this.props.tipoPonto = TipoPonto.create("Norte").getValue();
  }

  public toParedeOeste() {
    this.props.tipoPonto = TipoPonto.create("Oeste").getValue();
  }

  public toVazio() {
    this.props.tipoPonto = TipoPonto.create(" ").getValue();
  }

  public toPassagem() {
    this.props.tipoPonto = TipoPonto.create("Passagem").getValue();
  }

  public toPorta() {
    this.props.tipoPonto = TipoPonto.create("Porta").getValue();
  }

  public toPassagemNorte() {
    this.props.tipoPonto = TipoPonto.create("PassagemNorte").getValue();
  }

  public toPassagemOeste() {
    this.props.tipoPonto = TipoPonto.create("PassagemOeste").getValue();
  }
  public toPortaNorte() {
    this.props.tipoPonto = TipoPonto.create("PortaNorte").getValue();
  }
  public toPortaNorteOeste() {
    this.props.tipoPonto = TipoPonto.create("PortaNorteOeste").getValue();
  }
  public toPortaOeste() {
    this.props.tipoPonto = TipoPonto.create("PortaOeste").getValue();
  }
}
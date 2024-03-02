import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Nome } from "./Nome";
import { Dimensao } from "./Dimensao";
import { DescricaoEdificio } from "./DescricaoEdificio";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Piso } from "../piso/Piso";
import { Guard } from "../../core/logic/Guard";
import { Elevador } from "../elevador/Elevador";
import { Ponto } from "../ponto/Ponto";
import { TipoPonto } from "../ponto/TipoPonto";



interface EdificioProps {
  nome?: Nome;
  dimensao: Dimensao;
  descricao?: DescricaoEdificio;
  listaPisos: Piso[];
  elevador?: Elevador;
}

export class Edificio extends AggregateRoot<EdificioProps> {
  
  public getAllPisosWithMapa() : Piso[]{
    let listaPisos : Piso[] = [];
    for (let piso of this.props.listaPisos) {
      if (piso.hasMapa()) {
        listaPisos.push(piso);
      }
    }
    return listaPisos;
  }

  /*
  public obterPontoSeguinte(pontoProvided: Ponto, numeroPisoA: number, orientacao: string): Promise<Result<Ponto>> {

    let listaPisos = this.props.listaPisos;
    for (let index = 0; index < listaPisos.length; index++) {
      let piso = listaPisos[index];
      if (piso.returnNumeroPiso() === numeroPisoA) {

        if (pontoProvided.props.coordenadas.props.ordenada + 1 == piso.props.mapa.length
          && pontoProvided.props.coordenadas.props.abscissa + 1 == piso.props.mapa[piso.props.mapa.length - 1].length) {
          return Promise.resolve(Result.fail<Ponto>("este ponto X="+pontoProvided.props.coordenadas.props.abscissa+
           " Y="+pontoProvided.props.coordenadas.props.ordenada
          +" está num limite do piso não aceitavel"));
        }

        if (pontoProvided.props.coordenadas.props.ordenada + 1 == piso.props.mapa.length
          && pontoProvided.props.coordenadas.props.abscissa + 1 < piso.props.mapa[piso.props.mapa.length - 1].length
          && orientacao == "Norte") {
          return Promise.resolve(Result.ok<Ponto>(piso.props.mapa[piso.props.mapa.length - 1][pontoProvided.props.coordenadas.props.abscissa + 1]));
        }

        if (pontoProvided.props.coordenadas.props.ordenada == 0
          && pontoProvided.props.coordenadas.props.abscissa + 1 < piso.props.mapa[piso.props.mapa.length - 1].length
          && orientacao == "Norte") {
          return Promise.resolve(Result.ok<Ponto>(piso.props.mapa[0][pontoProvided.props.coordenadas.props.abscissa + 1]));
        }

        for (let i = 1; i < piso.props.mapa.length - 1; i++) {

          if (pontoProvided.props.coordenadas.props.abscissa + 1 == piso.props.mapa[piso.props.mapa.length - 1].length
            && orientacao == "Oeste") {
            return Promise.resolve(Result.ok<Ponto>(piso.props.mapa[i][pontoProvided.props.coordenadas.props.abscissa + 1]));
          }

          if (pontoProvided.props.coordenadas.props.abscissa == 0
            && orientacao == "Oeste") {
            return Promise.resolve(Result.ok<Ponto>(piso.props.mapa[i][0]));
          }


        }
      }
    }
    return Promise.resolve(Result.fail<Ponto>("Não foi possível obter o ponto seguinte"));
  }
  */
  public returnPisoPeloNumero(numeroPisoA: number): Piso {
    let listaPisos = this.props.listaPisos;
    for (let index = 0; index < listaPisos.length; index++) {
      let piso = listaPisos[index];
      if (piso.returnNumeroPiso() === numeroPisoA) {
        return piso;
      }
    }
    return null;
  }
 /*
  alterarPontosPorSala(pontoProvided: Ponto, nPiso: number, orientacao: string) {
    if (pontoProvided == null || pontoProvided == undefined) {
      return Promise.resolve(Result.fail<boolean>("Ponto não pode ser null"));
    }
    if (orientacao == null || orientacao == undefined) {
      return Promise.resolve(Result.fail<boolean>("Orientação não pode ser null ou undefined"));
    }
    if (nPiso == null || nPiso == undefined) {
      return Promise.resolve(Result.fail<boolean>("Número de piso não pode ser null ou undefined"));
    }
    if (orientacao != "Norte" && orientacao != "Oeste" && orientacao != "NorteOeste") {
      return Promise.resolve(Result.fail<boolean>("Orientação não é válida"));
    }

    let listaPisos = this.props.listaPisos;
    for (let index = 0; index < listaPisos.length; index++) {
      let piso = listaPisos[index];
      if (piso == null || piso == undefined) {
        return Promise.resolve(Result.fail<boolean>("Piso guardado no edifício não pode ser null ou undefined"));
      }
      if (piso.returnNumeroPiso() == nPiso) {
        for (let i = 0; i < piso.props.mapa.length; i++) {
          for (let j = 0; j < piso.props.mapa[i].length; j++) {
            let ponto = piso.props.mapa[i][j];
            if (ponto == null || ponto == undefined) {
              return Promise.resolve(Result.fail<boolean>("Ponto guardado no edifício não pode ser null ou undefined"));
            }
            if (ponto.props.coordenadas.props.abscissa == pontoProvided.props.coordenadas.props.abscissa
              && ponto.props.coordenadas.props.ordenada == pontoProvided.props.coordenadas.props.ordenada) {
              const tipoPonto = TipoPonto.create("Sala")
              if (tipoPonto.isFailure) {
                return Promise.resolve(Result.fail<boolean>(tipoPonto.error.toString()));
              }
              ponto.props.tipoPonto = tipoPonto.getValue();
              piso.props.mapa[i][j] = ponto;
              return Promise.resolve(Result.ok<boolean>(true));
            }
          }
        }
      }
    }
    return Promise.resolve(Result.ok<boolean>(false));
  }

 
  public alterarPontosPorPassagem(pontoProvided: Ponto, nPiso: number, orientacao: string): Promise<Result<boolean>> {

    if (pontoProvided == null || pontoProvided == undefined) {
      return Promise.resolve(Result.fail<boolean>("Ponto não pode ser null"));
    }
    if (orientacao == null || orientacao == undefined) {
      return Promise.resolve(Result.fail<boolean>("Orientação não pode ser null ou undefined"));
    }
    if (nPiso == null || nPiso == undefined) {
      return Promise.resolve(Result.fail<boolean>("Número de piso não pode ser null ou undefined"));
    }
    if (orientacao != "Norte" && orientacao != "Oeste" && orientacao != "NorteOeste") {
      return Promise.resolve(Result.fail<boolean>("Orientação não é válida"));
    }

    let listaPisos = this.props.listaPisos;
    for (let index = 0; index < listaPisos.length; index++) {
      let piso = listaPisos[index];
      if (piso == null || piso == undefined) {
        return Promise.resolve(Result.fail<boolean>("Piso guardado no edifício não pode ser null ou undefined"));
      }
      if (piso.returnNumeroPiso() == nPiso) {
        for (let i = 0; i < piso.props.mapa.length; i++) {
          for (let j = 0; j < piso.props.mapa[i].length; j++) {
            let ponto = piso.props.mapa[i][j];
            if (ponto == null || ponto == undefined) {
              return Promise.resolve(Result.fail<boolean>("Ponto guardado no edifício não pode ser null ou undefined"));
            }
            if (ponto.props.coordenadas.props.abscissa == pontoProvided.props.coordenadas.props.abscissa
              && ponto.props.coordenadas.props.ordenada == pontoProvided.props.coordenadas.props.ordenada) {
              const tipoPonto = TipoPonto.create("Passagem" + orientacao)
              if (tipoPonto.isFailure) {
                return Promise.resolve(Result.fail<boolean>(tipoPonto.error.toString()));
              }
              ponto.props.tipoPonto = tipoPonto.getValue();
              piso.props.mapa[i][j] = ponto;
              return Promise.resolve(Result.ok<boolean>(true));
            }
          }
        }
      }
    }
    return Promise.resolve(Result.ok<boolean>(false));
  }

  
  public returnPontoDoPisoEspecifico(abcissa: number, ordenada: number, numeroPiso: number): Promise<Result<Ponto>> {
    let listaPisos = this.props.listaPisos;
    for (let index = 0; index < listaPisos.length; index++) {
      let piso = listaPisos[index];
      if (piso == null || piso == undefined) {
        return Promise.resolve(Result.fail<Ponto>("Piso guardado no edifício não pode ser null ou undefined"));
      }
      if (piso.returnNumeroPiso() === numeroPiso) {
        for (let i = 0; i < piso.props.mapa.length; i++) {
          for (let j = 0; j < piso.props.mapa[i].length; j++) {
            let ponto = piso.props.mapa[i][j];
            if (ponto == null || ponto == undefined) {
              return Promise.resolve(Result.fail<Ponto>("Ponto guardado no edifício não pode ser null ou undefined"));
            }
            if (ponto.props.coordenadas.props.abscissa == abcissa && ponto.props.coordenadas.props.ordenada == ordenada) {
              return Promise.resolve(Result.ok<Ponto>(ponto));
            }
          }
        }
      }
    }
    return Promise.resolve(Result.fail<Ponto>("Não foi possível obter o ponto do piso específico"));
  }


  /**
   * Verifica se existe um ponto no limite do edifício
   * @param numeroPiso 
   * @param pontos 
   * @returns true se existir um ponto no limite, false caso contrário
   */

  /*public existePontoNoLimite(numeroPiso: number, pontos: Ponto): Promise<Result<boolean>> {

    if (pontos == null || pontos == undefined) {
      return Promise.resolve(Result.fail<boolean>("Ponto não pode ser null"));
    }
    if (numeroPiso == null || numeroPiso == undefined) {
      return Promise.resolve(Result.fail<boolean>("Número de piso não pode ser null ou undefined"));
    }

    let listaPisos = this.props.listaPisos;

    for (let index = 0; index < listaPisos.length; index++) {
      let piso = listaPisos[index];
      if (piso == null || piso == undefined) {
        return Promise.resolve(Result.fail<boolean>("Piso guardado no edifício não pode ser null ou undefined"));
      }
      if (piso.returnNumeroPiso() === numeroPiso) {
        for (let i = 0; i < piso.props.mapa.length; i++) {
          for (let j = 0; j < piso.props.mapa[i].length; j++) {
            let ponto = piso.props.mapa[i][j];
            if (ponto == null || ponto == undefined) {
              return Promise.resolve(Result.fail<boolean>("Ponto guardado no edifício não pode ser null ou undefined"));
            }
            if (ponto.props.coordenadas.props.abscissa == pontos.props.coordenadas.props.abscissa
              && ponto.props.coordenadas.props.ordenada == pontos.props.coordenadas.props.ordenada) {
              return Promise.resolve(Result.ok<boolean>(true));
            }
          }
        }
      }
    }

    return Promise.resolve(Result.ok<boolean>(false));
  }
  */
  private constructor(props: EdificioProps, id: UniqueEntityID) {
    super(props, id);
  }

  public addPiso(piso: Piso) {
    this.props.listaPisos.push(piso);
  }

  public static create(props: EdificioProps, codigo: UniqueEntityID): Result<Edificio> {

    const guardedProps = [{ argument: props.dimensao, argumentName: 'dimensão' },
    { argument: props.listaPisos, argumentName: 'lista de pisos' }];

    const result = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (result.succeeded === false) {
      return Result.fail<Edificio>(result.message);
    } else {
      const edificio = new Edificio({ ...props }, codigo);
      return Result.ok<Edificio>(edificio);
    }
  }

  public returnNome(): string {
    return this.props.nome.props.nome;
  }

  public returnDescricao(): string {
    return this.props.descricao.props.descricao;
  }

  public returnDimensaoX(): number {
    return this.props.dimensao.props.x;
  }

  public returnDimensaoY(): number {
    return this.props.dimensao.props.y;
  }

  public returnEdificioId(): string {
    return this.id.toString();
  }

  public returnListaPisos(): Piso[] {
    return this.props.listaPisos;
  }

  public returnListaPisosId(): number[] {
    let listaPisos: number[] = [];
    for (let i = 0; i < this.props.listaPisos.length; i++) {
      listaPisos.push(Number(this.props.listaPisos[i].id.toValue()));
    }
    return listaPisos;
  }

  public verificaSePisoJaExiste(nPiso: number): boolean {
    for (let i = 0; i < this.props.listaPisos.length; i++) {
      if (this.props.listaPisos[i].returnNumeroPiso() === nPiso) {
        return true;
      }
    }
    return false;
  }
  /**
   * Verifica se já existe um elevador no edifício
   * @returns true se existir um elevador, false caso contrário
   */
  public temElevador(): boolean {
    return this.props.elevador !== undefined;
  }

  /**
   * Verifica se é possível colocar um elevador numa determinada posição do edifício
   * @param xCoordSup coordenada x do ponto superior do elevador
   * @param yCoordSup coordenada y do ponto superior do elevador
   * @param orientacao 'norte' ou 'oeste' dita se o elevador está na vertical ou horizontal
   * @returns true se a posição é válida, false caso contrário
   */
  public posicaoValidaNoMapa(xCoordSup: number, yCoordSup: number, orientacao: string): boolean {
    //TODO
    /*
    - para todos os pisos no intervalo dos pisos servidos(ex serve pisos 1 e 3, tenho de ver o piso 2 na mesma):
      - não pode ser dentro de uma sala
      - não pode ter porta adjacente (na diagonal pode)
      - não pode ser em cima de uma passagem
    */
    // Coordenadas do ponto inferior
    let xCoordInf;
    let yCoordInf;

    if (orientacao === 'norte') {
      xCoordInf = xCoordSup;
      yCoordInf = yCoordSup + 1;
    } else if (orientacao === 'oeste') {
      xCoordInf = xCoordSup + 1;
      yCoordInf = yCoordSup;
    }

    // Coordendas do ponto inferior têm de estar dentro das dimensões do edifício
    if (xCoordInf > this.props.dimensao.props.x || yCoordInf > this.props.dimensao.props.y) {
      return false;
    }
    return true;
  }

  public adicionarElevador(elevador: Elevador) {
    this.props.elevador = elevador;
  }

  public returnElevadorId(): number {
    return Number(this.props.elevador.id.toValue());

  }

  public verificaSeONumeroDePisosEstaDentroDosLimites(minPisos: number, maxPisos: number): boolean {
    if (this.props.listaPisos.length >= minPisos && this.props.listaPisos.length <= maxPisos) {
      return true;
    }
    return false;
  }
  /**
   * Retorna o elevador do Edifício
   * @returns instância do elevador se existir, null caso não existir
   */
  public returnElevador(): Elevador {
    if (this.temElevador()) {
      return this.props.elevador;
    } else {
      return null;
    }
  }
  /**
   * Obter os pisos de um edifício a partir de um array de números de piso
   * @param numerosDePiso números dos pisos para dar match
   * @returns array de pisos que deram match
   */
  public pisosCorrespondentes(numerosDePiso: number[]): Piso[] {
    let res: Piso[] = [];

    for (let i = 0; i < this.props.listaPisos.length; i++) {
      for (let j = 0; j < numerosDePiso.length; j++) {
        if (this.props.listaPisos[i].returnNumeroPiso() === numerosDePiso[j]) {
          res.push(this.props.listaPisos[i]);
        }
      }
    }

    return res;
  }

  public alterarDescricao(descricao: DescricaoEdificio) {
    this.props.descricao = descricao;
  }

  public alterarNome(nome: Nome) {
    this.props.nome = nome;
  }
}
export interface IMapaPersistence {
    idMapa: number;
	mapa: string[][];
    idPassagem : number[];
    abcissaSupPassagem : number[];
    ordenadaSupPassagem : number[];
    abcissaInfPassagem : number[];
    ordenadaInfPassagem : number[];
    orientacaoPassagem : string[];
    xCoordElevador: number;
    yCoordElevador: number;
    orientacaoElevador: string;
    nomeSala: string[];
    abcissaASala : number[];
    ordenadaASala : number[];
    abcissaBSala : number[];
    ordenadaBSala : number[];
    abcissaPorta : number[];
    ordenadaPorta : number[];
    orientacaoPorta : string[];
  }
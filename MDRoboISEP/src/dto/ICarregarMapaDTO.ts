export default interface ICarregarMapaDTO{
    codigoEdificio: string,
    numeroPiso: number,
    passagens : [{
        id : number,
        abcissa : number,
        ordenada : number,
        orientacao : string,
    }],
    elevador : {
        xCoord : number,
        yCoord : number,
        orientacao: string, 
    },
    salas: [{
        nome: string,
        abcissaA : number,
        ordenadaA : number,
        abcissaB : number,
        ordenadaB : number,
        abcissaPorta : number,
        ordenadaPorta : number,
        orientacaoPorta : string,
    }]
}
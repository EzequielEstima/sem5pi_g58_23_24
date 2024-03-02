export default interface ExportarMapa{
    texturaChao: string,
    texturaParede: string,
    modeloPorta: string,
    modeloElevador: string,
    codigoEdificio: string,
    numeroPiso : number,
    matriz : string[][],
    elevador: {
        xCoord: number,
        yCoord: number,
        orientacao: string
    },
    passagens : [{
        id: number,
        abcissaA: number,
        ordenadaA: number,
        abcissaB: number,
        ordenadaB: number,
        orientacao: string
    }],
    salas ?: [{
        nome: string,
        abcissaA : number,
        ordenadaA: number,
        abcissaB: number,
        ordenadaB: number,
        abcissaPorta: number,
        ordenadaPorta: number,
        orientacaoPorta: string,
    }],
    posicaoInicialRobo : {
        x: number,
        y: number,
    }
}
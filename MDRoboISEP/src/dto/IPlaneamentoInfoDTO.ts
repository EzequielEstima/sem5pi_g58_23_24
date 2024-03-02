export default interface IPlaneamentoInfoDTO {
    pisos: string[];
    elevadores: string[];
    coordElevadores: string[];
    corredores: string[];   
    coordCorredores: string[];
    salas: string[];
    coordPortas: string[];
    listaMatrizMapa: string[];
    dimensoes: string[];
    x_origem: string;
    y_origem: string;
    piso_origem: string;
    x_destino: string;
    y_destino: string;
    piso_destino: string;
}
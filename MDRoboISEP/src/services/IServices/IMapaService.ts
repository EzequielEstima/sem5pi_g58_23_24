import { Result } from "../../core/logic/Result";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";
import IExportarMapaDTO from "../../dto/IExportarMapaDTO";
import IPlaneamentoCaminhosDTO from "../../dto/IPlaneamentoCaminhosDTO";

export default interface IMapaService{
    exportarMapaParaOPlaneamento(): Promise<Result<IPlaneamentoCaminhosDTO>>;
    carregarMapa(json : ICarregarMapaDTO) : Promise<Result<ICarregarMapaDTO>>;
    exportarMapa(mapaDTO : IExportarMapaDTO) : Promise<Result<IExportarMapaDTO>>;
    exportarMapaAtravesDeUmaPassagemEPiso(idPassagem: number, codEd: string, numeroPiso: number) : Promise<Result<IExportarMapaDTO>>;
}
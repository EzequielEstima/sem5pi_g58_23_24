import { Container, Service, Inject } from 'typedi';

import jwt from 'jsonwebtoken';
import config from '../../../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';


import { UserMap } from "../../mappers/UserMap";
import { IUserDTO } from '../../dto/IUserDTO';

import ICriarPisoDTO from '../../dto/ICriarPisoDTO';


import { Role } from '../../domain/role';

import { Result } from "../../core/logic/Result";
import IDispositivoService from '../IServices/IDispositivoService';
import IAdicionarRoboAFrotaDTO from '../../dto/IAdicionarRoboAFrotaDTO';
import IDispositivoDTO from '../../dto/IDispositivoDTO';
import ITipoDispositivoRepo from '../IRepos/ITipoDispositivoRepo';
import IDispositivoRepo from '../IRepos/IDispositivoRepo';
import { Dispositivo } from '../../domain/dispositivo/Dispositivo';
import { NumeroDeSerie } from '../../domain/dispositivo/NumeroDeSerie';
import { DescricaoDispositivo } from '../../domain/dispositivo/DescricaoDispositivo';
import { Nickname } from '../../domain/dispositivo/Nickname';
import { EstadoDispositivo } from '../../domain/dispositivo/EstadoDispositivo';
import { result } from 'lodash';
import { CodigoDispositivo } from '../../domain/dispositivo/CodigoDispositivo';
import { DispositivoMap } from '../../mappers/DispositivoMap';
import IDispositivoInibirDTO from '../../dto/IDispositivoInibirDTO';
import { TipoDispositivo } from '../../domain/tipoDispositivo/TipoDispositivo';
import { IdTipoDispositivo } from '../../domain/tipoDispositivo/IdTipoDispositivo';
import { Marca } from '../../domain/tipoDispositivo/Marca';
import ICodigoDosDispositivosPorTarefaDTO from '../../dto/ICodigoDosDispositivosPorTarefaDTO';


@Service()
export default class DispositivoService implements IDispositivoService{
  constructor(
      @Inject(config.repos.tipoDispositivo.name) private tipoDispositivoRepo : ITipoDispositivoRepo,
      @Inject(config.repos.dispositivo.name) private dispositivoRepo : IDispositivoRepo,
  ) {}
    public async inibirDispositivo(dispositivoDTO: IDispositivoInibirDTO): Promise<Result<IDispositivoInibirDTO>> {
        try { 
            let disposi = await this.dispositivoRepo.findByDomainId(dispositivoDTO.codigo);
            let flag = !!disposi;
            if(!flag){
                return Result.fail<IDispositivoInibirDTO>("O dispositivo com o codigo " + dispositivoDTO.codigo +" não existe");
            }
            disposi.inibirDispositivo();
            disposi = await this.dispositivoRepo.save(disposi);
            if (disposi === null) {
                return Result.fail<IDispositivoInibirDTO>("O dispositivo com o codigo " + dispositivoDTO.codigo +" não foi persistido");
            }
            return Result.ok<IDispositivoInibirDTO>(DispositivoMap.toDTO(disposi));
        } catch (e) {
            throw e;
        }
    }


  public async adicionarDispositivoAFrota(adicionarRoboAFrotaDTO: IAdicionarRoboAFrotaDTO ): Promise<Result<IDispositivoDTO>> {
    try {
        const tipoDispositivo = await this.tipoDispositivoRepo.findByDomainId(adicionarRoboAFrotaDTO.tipoDispositivo);
        let flag = !!tipoDispositivo;
        if(!flag){
            return Result.fail<IDispositivoDTO>("O tipo de dispositivo com o id " + adicionarRoboAFrotaDTO.tipoDispositivo +" não existe");
        }
        let dispositivo = await this.dispositivoRepo.findByDomainId(adicionarRoboAFrotaDTO.codigo);
        flag = !!dispositivo;
        if(flag){
            return Result.fail<IDispositivoDTO>("O dispositivo com o codigo " + adicionarRoboAFrotaDTO.codigo +" já existe");
        }
        dispositivo = await this.dispositivoRepo.findByNickname(adicionarRoboAFrotaDTO.nickname);
        flag = !!dispositivo;
        if(flag){
            return Result.fail<IDispositivoDTO>("O dispositivo com o nickname " + adicionarRoboAFrotaDTO.nickname +" já existe");
        }
        let listaDispositivos = await this.dispositivoRepo.findByNumeroSerie(adicionarRoboAFrotaDTO.numeroSerie);
        for(let elemento of listaDispositivos){
            if(elemento.returnTipoDispositivoMarca() === tipoDispositivo.returnMarca() && elemento.returnTipoDispositivoModelo() === tipoDispositivo.returnModelo()){
                return Result.fail<IDispositivoDTO>("O dispositivo com o numero de serie " + adicionarRoboAFrotaDTO.numeroSerie +" já existe");  
            }
        }
        
        let resultado;
        let descricao;
        let codigoOrError = CodigoDispositivo.create(adicionarRoboAFrotaDTO.codigo);
        let nicknameOrError = Nickname.create(adicionarRoboAFrotaDTO.nickname);
        let numeroDeSerieOrError = NumeroDeSerie.create(adicionarRoboAFrotaDTO.numeroSerie);
        let estadoOrError = EstadoDispositivo.create(true);
        if (adicionarRoboAFrotaDTO.descricaoDispositivo === null || adicionarRoboAFrotaDTO.descricaoDispositivo === undefined) {
            resultado = Result.combine([codigoOrError, nicknameOrError, numeroDeSerieOrError, estadoOrError]);
            descricao = null;
        }else{
            let descricaoOrError = DescricaoDispositivo.create(adicionarRoboAFrotaDTO.descricaoDispositivo);
            resultado = Result.combine([codigoOrError, nicknameOrError, numeroDeSerieOrError, estadoOrError, descricaoOrError]);
            if(descricaoOrError.isSuccess){
                descricao = descricaoOrError.getValue();
            }
        }
        
        let dispositivoOrError;
        if(resultado.isFailure){
            return Result.fail<IDispositivoDTO>(resultado.errorValue());
        }else{
            dispositivoOrError = Dispositivo.create({
                descricaoDispositivo: descricao,
                estado: estadoOrError.getValue(),
                nickname: nicknameOrError.getValue(),
                numeroSerie: numeroDeSerieOrError.getValue(),
                tipoDeDispositivo: tipoDispositivo
            }, codigoOrError.getValue());
        }
        
        if(dispositivoOrError.isFailure){
            return Result.fail<IDispositivoDTO>(dispositivoOrError.errorValue());
        }else{
            dispositivo = dispositivoOrError.getValue();
        }
        
        dispositivo = await this.dispositivoRepo.save(dispositivo);

        return Result.ok<IDispositivoDTO>(DispositivoMap.toDTO(dispositivo));
    } catch (e) {
      throw e;
    }
  }

  public async listarDispositivosDaFrota(): Promise<Result<IDispositivoDTO[]>> {
    try {
        const dispositivos = await this.dispositivoRepo.findAll();

        let listaDispositivosDTO: IDispositivoDTO[] = [];
        
        if(dispositivos.length === 0){
            return Result.fail<IDispositivoDTO[]>("Não existem dispositivos na frota");
        }
        for (let dispositivo of dispositivos) {
            listaDispositivosDTO.push(DispositivoMap.toDTO(dispositivo));
        }
        
        return Result.ok<IDispositivoDTO[]>(listaDispositivosDTO);
    } catch (e) {
      throw e;
    }
  }

  public async listarCodigoDosDispositivosDaFrotaPorTarefa(): Promise<Result<ICodigoDosDispositivosPorTarefaDTO>> {
    try {
        const dispositivos = await this.dispositivoRepo.findAll();

        let listaDispositivosPorTarefaDTO: ICodigoDosDispositivosPorTarefaDTO;
        let listaDispositivosVigilancia: string[] = [];
        let listaDispositivosPickup: string[] = [];
        listaDispositivosPorTarefaDTO = {
            dispositivosVigilancia: listaDispositivosVigilancia,
            dispositivosPickup: listaDispositivosPickup
        };

        
        if(dispositivos.length === 0){
            return Result.fail<ICodigoDosDispositivosPorTarefaDTO>("Não existem dispositivos na frota");
        }
        for (let dispositivo of dispositivos) {
            if(dispositivo.returnEstado()){
                if(dispositivo.props.tipoDeDispositivo.returnTipoTarefa().includes("Vigilancia")){
                    listaDispositivosVigilancia.push(dispositivo.returnCodigoDispositivo());
                }
                if(dispositivo.props.tipoDeDispositivo.returnTipoTarefa().includes("PickUp/Delivery")){
                    listaDispositivosPickup.push(dispositivo.returnCodigoDispositivo());
                }    
            }
        }
        
        if (listaDispositivosVigilancia.length === 0 && listaDispositivosPickup.length === 0) {
            return Result.fail<ICodigoDosDispositivosPorTarefaDTO>("Não existem dispositivos na frota disponiveis");
        }

        return Result.ok<ICodigoDosDispositivosPorTarefaDTO>(listaDispositivosPorTarefaDTO);
    } catch (e) {
      throw e;
    }
  }
}

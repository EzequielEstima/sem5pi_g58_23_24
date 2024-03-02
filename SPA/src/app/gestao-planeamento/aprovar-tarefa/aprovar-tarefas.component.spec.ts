import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarGestaoPlaneamentoComponent } from '../sidebar-gestao-planeamento/sidebar-gestao-planeamento.component';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TarefaService } from 'src/serviceInfo/tarefa.service';

import { of } from 'rxjs';


import { AprovarTarefaComponent } from './aprovar-tarefa.component';
import { DispositivoService } from 'src/serviceInfo/dispositivo.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Tarefa from 'src/dataModel/tarefa';
import CodigoDosDispositivosPorTarefa from 'src/dataModel/codigoDosDispositivosPorTarefa';

describe('AprovarTarefaComponent', () => {
  let component: AprovarTarefaComponent;
  let fixture: ComponentFixture<AprovarTarefaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AprovarTarefaComponent,SidebarGestaoPlaneamentoComponent,MessageComponent],
      imports: [HttpClientTestingModule,HttpClientModule],
      providers: [TarefaService,DispositivoService],
    });
    fixture = TestBed.createComponent(AprovarTarefaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[Aprovar Tarefa] deve chamar o método getTarefasPendentes na inicialização do Componente (ngOnInit)', () => {
    
    const tarefaMock = {
        codConfirmacao: null,
        codDispositivo: "",
        codEdificio: "A",
        descricaoEntrega: null,
        emailRequisitor: "emailPlaceholder",
        estadoString: "Pendente",
        id: "1",
        nomeVigilancia: "Cavaco Silva",
        numeroPiso: 1,
        numeroVigilancia: "987654321",
        percursoString:"percursoVigilanciaPlaceholder",
        tipoTarefa: "Vigilancia"
        } as unknown as Tarefa;

    const mockData = [tarefaMock];

    spyOn(component['tarefaService'], 'getTarefasPendentes').and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.listaTarefas).toEqual(mockData);
  });

  it('[Aprovar Tarefa] obterRobo deve chamar o método listarCodigoDosDispositivosDaFrotaPorTarefa do método dispositivo service', () => {
    
    const obterRoboMock = {
        dispositivosVigilancia: ['Vigilancia', 'FazTudo'],
        dispositivosPickup: ['Pickup', 'FazTudo']
    } as unknown as CodigoDosDispositivosPorTarefa;

    spyOn(component['dispositivoService'], 'listarCodigoDosDispositivosDaFrotaPorTarefa').and.returnValue(of(obterRoboMock));
    component.obterRobo('Vigilancia', '1');

    expect(component.listaRobos).toEqual(obterRoboMock.dispositivosVigilancia);
    expect(component.existeRobo).toEqual(true);
    expect(component.idTarefa).toEqual('1');
  });

  it('[Aprovar Tarefa] alterarEstadoDaTarefa deve chamar o método alterarEstadoTarefa do tarefa service', () => {
    
    let tarefaService = TestBed.inject(TarefaService);
    spyOn(component['tarefaService'], 'alterarEstadoTarefa');

    component.alterarEstadoDaTarefa('1','Aceite','Vigilancia');

    expect(tarefaService.alterarEstadoTarefa).toHaveBeenCalledWith('1','Aceite','Vigilancia');
  });
});
   
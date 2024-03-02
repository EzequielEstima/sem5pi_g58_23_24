import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarGestaoPlaneamentoComponent } from '../sidebar-gestao-planeamento/sidebar-gestao-planeamento.component';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TarefaService } from 'src/serviceInfo/tarefa.service';

import { of } from 'rxjs';

import { ListarTarefasPendentesComponent } from './listar-tarefas-pendentes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Tarefa from 'src/dataModel/tarefa';
import CodigoDosDispositivosPorTarefa from 'src/dataModel/codigoDosDispositivosPorTarefa';

describe('ListarTarefasPendentesComponent', () => {
  let component: ListarTarefasPendentesComponent;
  let fixture: ComponentFixture<ListarTarefasPendentesComponent>;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarTarefasPendentesComponent,SidebarGestaoPlaneamentoComponent,MessageComponent],
      imports: [HttpClientTestingModule,HttpClientModule],
      providers: [TarefaService],
    });
    fixture = TestBed.createComponent(ListarTarefasPendentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método ngOnInit chama o método getTarefasPendentes', ()=>{
    const listaTarefas = [{
      tipoTarefa: "string",
      id: "string",
      percursoString: "string",
      estadoString: "string",
      emailRequisitor: "string",
      codDispositivo: "string",
      codConfirmacao: "string" ,
      descricaoEntrega: "string",
      nomePickUp: "string",
      numeroPickUp: "string",
      nomeDelivery: "string",
      numeroDelivery: "string",
      salaInicial: "string",
      salaFinal: "string",
      nomeVigilancia: "string",
      numeroVigilancia: "string",
      codEdificio: "string",
      numeroPiso: 2
    }] as Tarefa[];
    let tarefaService = TestBed.inject(TarefaService);
    spyOn(component['tarefaService'], 'getTarefasPendentes').and.returnValue(of(listaTarefas));
    component.ngOnInit();
    expect(tarefaService.getTarefasPendentes).toHaveBeenCalled();
    expect(component.listaTarefas).toEqual(listaTarefas);
  });

});
   
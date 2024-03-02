import { ObterTarefaComponent } from './obter-tarefa.component'
import { SidebarGestaoPlaneamentoComponent } from '../sidebar-gestao-planeamento/sidebar-gestao-planeamento.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from '../../message/message.component'
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TarefaService } from '../../../serviceInfo/tarefa.service';
import { TestBed, ComponentFixture } from '@angular/core/testing'; 
import { Router } from '@angular/router';
import Tarefa from 'src/dataModel/tarefa';
import { of } from 'rxjs';


describe('ObterTarefaComponent', () => {
  let component: ObterTarefaComponent;
  let fixture: ComponentFixture<ObterTarefaComponent>;
  let tarefaService: TarefaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObterTarefaComponent, SidebarGestaoPlaneamentoComponent, MessageComponent],
      imports: [HttpClientTestingModule, HttpClientModule, BrowserModule, FormsModule],
      providers: [TarefaService,Router],
    });
    fixture = TestBed.createComponent(ObterTarefaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tarefaService = TestBed.inject(TarefaService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(tarefaService).toBeTruthy();
  });

  it('should have null initial values', () => {
    expect(component.selectedCriteria).toBeNull();
    expect(component.selectedValue).toBeNull();
  });

  it('should change selectedValue on changeValue call', () => {
    const testEmail = 'test@example.com';
    component.changeValue(testEmail);
    expect(component.selectedValue).toBe(testEmail);
  });

  it('should call add and use tarefaService', () => {
    spyOn(tarefaService, 'obterTarefa').and.returnValue(of(null));
    component.tarefasPlaneadas = false
    component.selectedCriteria = 'criteria';
    component.selectedValue = 'value';
    component.add();
  
    expect(tarefaService.obterTarefa).toHaveBeenCalledWith('criteria', 'value');
  });

})
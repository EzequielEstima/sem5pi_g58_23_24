import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExportarDadosPessoaisComponent } from './exportar-dados-pessoais.component';
import { SidebarContaComponent } from '../sidebar-conta/sidebar-conta.component';
import { MessageComponent } from '../../message/message.component';
import { ContaService } from 'src/serviceInfo/conta.service';
import { of } from 'rxjs';
import { DadosPessoaisUser } from 'src/dataModel/dadosPessoaisUser';

describe('ExportarDadosPessoaisComponent', () => {
  let component: ExportarDadosPessoaisComponent;
  let fixture: ComponentFixture<ExportarDadosPessoaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportarDadosPessoaisComponent, SidebarContaComponent, MessageComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportarDadosPessoaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método export chama o método exportarDadosPessoais de contaService', () => {
    let conta = {
      name: "name",
      email: "email@isep.ipp.pt",
      telefone: "123123123",
      nif: "123123123",
    } as DadosPessoaisUser;
    let contaService = TestBed.inject(ContaService);
    let spy = spyOn(component['contaService'], 'exportarDadosPessoais').and.returnValue(of(conta));
    component.export();
    expect(spy).toHaveBeenCalled();

  });
});

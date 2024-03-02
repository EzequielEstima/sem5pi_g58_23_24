import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPassagemComponent } from './editar-passagem.component';
import { PassagemService } from '../../../serviceInfo/passagem.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { PisoService } from 'src/serviceInfo/piso.service';

describe('CriarPassagemComponent', () => {
  let component: EditarPassagemComponent;
  let fixture: ComponentFixture<EditarPassagemComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarPassagemComponent,SidebarComponent,MessageComponent],
      providers: [PassagemService,EdificioService,PisoService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(EditarPassagemComponent);
    component = fixture.componentInstance
  });

  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar o método listarCodEdificios na inicialização do Componente (ngOnInit)', () => {
    const mockData = ['cod1', 'cod2'];
    spyOn(component['edificioService'], 'listarCodEdificios').and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.listaCodigos).toEqual(mockData);
  });

  it('deve chamar o método listarNumeroPisos do piso service método listarNumeroPisosA', () => {
    const mockData = [1,2];
    spyOn(component['pisoService'], 'listarNumeroPisos').and.returnValue(of(mockData));
    component.listarNumeroPisosA("cod1");

    expect(component.listaNumeroPisosA).toEqual(mockData);
  });

  it('deve chamar o método listarNumeroPisos do piso service método listarNumeroPisosB', () => {
    const mockData = [1,2];
    spyOn(component['pisoService'], 'listarNumeroPisos').and.returnValue(of(mockData));
    component.listarNumeroPisosB("cod2");

    expect(component.listaNumeroPisosB).toEqual(mockData);
  });


  it('deve chamar o método editarPassagem', () => {
    const id = 1;
    const codigoB = 'code1';
    const codigoA = 'code2';
    const numeroPisoA = 1;
    const numeroPisoB = 2;
    let passagemService = TestBed.inject(PassagemService);
    spyOn(component['passagemService'], 'editarPassagem');
    component.editarPassagem(id, codigoA, codigoB, numeroPisoA, numeroPisoB);

    expect(passagemService.editarPassagem).toHaveBeenCalledWith(id, codigoA, codigoB, numeroPisoA, numeroPisoB);
  });

});

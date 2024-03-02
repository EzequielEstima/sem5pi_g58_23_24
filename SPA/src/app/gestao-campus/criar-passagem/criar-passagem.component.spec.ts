import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarPassagemComponent } from './criar-passagem.component';
import { PassagemService } from '../../../serviceInfo/passagem.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { PisoService } from 'src/serviceInfo/piso.service';

describe('EditarPassagemComponent', () => {
  let component: CriarPassagemComponent;
  let fixture: ComponentFixture<CriarPassagemComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriarPassagemComponent,SidebarComponent,MessageComponent],
      providers: [PassagemService,EdificioService,],
      imports: [HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(CriarPassagemComponent);
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

  it('deve chamar o método listarNumeroPisos do piso service método listarNumeroPisosB', () => {
    const id = 1;
    const codigoB = 'code1';
    const codigoA = 'code2';
    const numeroPisoA = 1;
    const numeroPisoB = 2;
    let passagemService = TestBed.inject(PassagemService);
    spyOn(component['passagemService'], 'criarPassagem');
    component.add(id, codigoA, codigoB, numeroPisoA, numeroPisoB);

    expect(passagemService.criarPassagem).toHaveBeenCalledWith(id, codigoA, codigoB, numeroPisoA, numeroPisoB);
  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarPisoComponent } from './criar-piso.component';
import { PisoService } from '../../../serviceInfo/piso.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

describe('CriarPisoComponent', () => {
  let component: CriarPisoComponent;
  let fixture: ComponentFixture<CriarPisoComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriarPisoComponent,SidebarComponent,MessageComponent],
      providers: [PisoService,EdificioService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(CriarPisoComponent);
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

  it('deve chamar o método criarPiso do piso service método add', () => {
    const codigo = 'code1';
    const numeroPiso = '1';
    const descricaoPiso = 'Description';
    let pisoService = TestBed.inject(PisoService);
    spyOn(component['pisoService'], 'criarPiso');
    component.add(codigo, numeroPiso, descricaoPiso);

    expect(pisoService.criarPiso).toHaveBeenCalledWith(codigo, numeroPiso, descricaoPiso);
  });

});

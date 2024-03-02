import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarSalaComponent } from './criar-sala.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from 'src/app/message/message.component';
import { SalaService } from 'src/serviceInfo/sala.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

describe('CriarSalaComponent', () => {
  let component: CriarSalaComponent;
  let fixture: ComponentFixture<CriarSalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriarSalaComponent,SidebarComponent,MessageComponent],
      providers: [SalaService,EdificioService,],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('deve chamar o método criarSala do sala service método criarSala', () => {
    const id = "1";
    const codigoEdificio = 'code1';
    const numeroPiso = 1;
    const descricao = 'desc1';
    const categoria = 'cat1';
    let salaService = TestBed.inject(SalaService);
    spyOn(component['salaService'], 'criarSala');
    component.add(id, codigoEdificio, numeroPiso, descricao, categoria);

    expect(salaService.criarSala).toHaveBeenCalledWith(id, codigoEdificio, numeroPiso, descricao, categoria);
  });

});

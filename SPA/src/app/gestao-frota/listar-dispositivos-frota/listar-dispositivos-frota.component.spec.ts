import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarDispositivosFrotaComponent } from './listar-dispositivos-frota.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SidebarFrotaComponent } from '../sidebar-frota/sidebar-frota.component';
import { MessageComponent } from '../../message/message.component';
import { DispositivoService } from 'src/serviceInfo/dispositivo.service';
import { Dispositivo } from 'src/dataModel/dispositivo';
import { of } from 'rxjs';


describe('ListarDispositivosFrotaComponent', () => {
  let component: ListarDispositivosFrotaComponent;
  let fixture: ComponentFixture<ListarDispositivosFrotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarDispositivosFrotaComponent,SidebarFrotaComponent,MessageComponent],
      imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(ListarDispositivosFrotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método ngOnInit chama o método listarCodEdificios do edificioService', () => {
    const listaDispositivos = [
      {tipoDispositivo: 1,
      codigo: 'ola',
      descricaoDispositivo: '0la',
      estado: true,
      nickname: 'ola',
      numeroSerie: 'ola',
      } as Dispositivo
    ];
    let dispositivoService = TestBed.inject(DispositivoService);
    spyOn(component['dispositivoService'], 'listarDispositivosFrota').and.returnValue(of(listaDispositivos));
    component.ngOnInit();
    expect(dispositivoService.listarDispositivosFrota).toHaveBeenCalled();
    expect(component.listaDispositivos).toEqual(listaDispositivos);
  });

});

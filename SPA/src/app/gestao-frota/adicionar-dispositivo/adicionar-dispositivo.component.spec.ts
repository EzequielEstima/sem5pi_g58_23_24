import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DispositivoService } from 'src/serviceInfo/dispositivo.service';
import { SidebarFrotaComponent } from '../sidebar-frota/sidebar-frota.component';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdicionarDispositivoComponent } from './adicionar-dispositivo.component';

describe('AdicionarDispositivoComponent', () => {
  let component: AdicionarDispositivoComponent;
  let fixture: ComponentFixture<AdicionarDispositivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdicionarDispositivoComponent,SidebarFrotaComponent,MessageComponent],
      providers: [DispositivoService],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(AdicionarDispositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('add deve chamar o método criarDispositivo do dispositivoService', () => {
    const codigo= "cod";
    const nickname= "nick";
    const idTipoDispositivo= "1";
    const numeroSerie= "123sad21";
    const descricao= "sdsdasd";
    let dispositivoService = TestBed.inject(DispositivoService);
    spyOn(component['dispositivoService'], 'adicionarDispositivoAFrota');
    component.add(codigo, nickname, idTipoDispositivo, numeroSerie, descricao);

    expect(dispositivoService.adicionarDispositivoAFrota).toHaveBeenCalledWith(codigo, nickname, idTipoDispositivo, numeroSerie, descricao);
  });
});

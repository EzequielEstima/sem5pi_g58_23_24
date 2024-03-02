import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InibirDispositivoComponent } from './inibi-dispositivo.component';
import {SidebarFrotaComponent} from '../sidebar-frota/sidebar-frota.component';
import {MessageComponent} from '../../message/message.component';
import { DispositivoService } from 'src/serviceInfo/dispositivo.service';

describe('InibirDispositivoComponent', () => {
  let component: InibirDispositivoComponent;
  let fixture: ComponentFixture<InibirDispositivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InibirDispositivoComponent, SidebarFrotaComponent, MessageComponent],
      imports: [HttpClientTestingModule],
      providers: [DispositivoService],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InibirDispositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método add chama o método inibirDispositivo do dispositivoService', () => {
    const codigo = "MOD1";
    const listaCod = [codigo];

    let dispositivoService = TestBed.inject(DispositivoService);
    spyOn(component['dispositivoService'], 'inibirDispositivo');
    component.listaCod = listaCod;
    component.add(codigo);
    expect(dispositivoService.inibirDispositivo).toHaveBeenCalledWith(codigo);
  });
});

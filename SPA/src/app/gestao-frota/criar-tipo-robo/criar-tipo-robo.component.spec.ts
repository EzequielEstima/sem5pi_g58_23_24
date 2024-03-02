import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CriarTipoRoboComponent } from './criar-tipo-robo.component';
import { MapaService } from '../../../serviceInfo/mapa.service';
import {SidebarFrotaComponent} from '../sidebar-frota/sidebar-frota.component';
import {MessageComponent} from '../../message/message.component';
import { TipoRoboService } from 'src/serviceInfo/tipo-robo.service';
import { FormsModule } from '@angular/forms';

describe('CriarTipoRoboComponent', () => {
  let component: CriarTipoRoboComponent;
  let fixture: ComponentFixture<CriarTipoRoboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriarTipoRoboComponent, SidebarFrotaComponent, MessageComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [MapaService],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarTipoRoboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método add chama o método criarTipoRobo do tipoRoboService', () => {
    const marca = "marca";
    const modelo = "modelo";
    component.listaTipoTarefa[0].selected = true;
    component.listaTipoTarefa[1].selected = true;
    let tipoTarefa = ['Vigilância', 'PickUp/Delivery'];

    let tipoRoboService = TestBed.inject(TipoRoboService);
    spyOn(component['tipoRoboService'], 'criarTipoRobo');
    component.listaTipoTarefaSelecionados = tipoTarefa;
    component.add(marca, modelo);
    expect(tipoRoboService.criarTipoRobo).toHaveBeenCalledWith(tipoTarefa, marca, modelo);
  });
});

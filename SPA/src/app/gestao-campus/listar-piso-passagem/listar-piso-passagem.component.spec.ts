import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ElevadorService } from 'src/serviceInfo/elevador.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from '../../message/message.component';
import { FormBuilder } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { Observable, of } from 'rxjs';
import { ListarElevador } from 'src/dataModel/listarElevador';
import { ListarPisoPassagemComponent } from './listar-piso-passagem.component';
import { ListarPassagem } from 'src/dataModel/listarPassagem';
import { PassagemService } from 'src/serviceInfo/passagem.service';
import { PisoService } from 'src/serviceInfo/piso.service';


describe('ListarPisoPassagemComponent', () => {
  let component: ListarPisoPassagemComponent;
  let fixture: ComponentFixture<ListarPisoPassagemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPisoPassagemComponent, SidebarComponent, MessageComponent],
      imports: [HttpClientTestingModule],
      providers: [EdificioService, PassagemService, PisoService, FormBuilder],
    });
    fixture = TestBed.createComponent(ListarPisoPassagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método ngOnInit chama o método listarPisoComPassagem do passagemService', () => {
    interface TabelaInfo {
      idPassagem: string;
      passagem: string;
      pisoInfo: string;
      edificio: string;
    }

    const passagem = 
      {       
        idPassagem: "50",
        passagem: "14 -> 15",
        pisoInfo: "14 - 2:",
        edificio: "14-A",
      } as unknown as TabelaInfo

      const listaPassagens = [passagem];

      const observable : Observable<TabelaInfo[]> = of(listaPassagens);
      
    let passagemService = TestBed.inject(PassagemService);
    spyOn(component['passagemService'], 'listarPisoComPassagem').and.returnValue(observable);
    component.ngOnInit();
    expect(passagemService.listarPisoComPassagem).toHaveBeenCalled(); 
    expect(component.tabelaInfo).toEqual(listaPassagens);
  });
});

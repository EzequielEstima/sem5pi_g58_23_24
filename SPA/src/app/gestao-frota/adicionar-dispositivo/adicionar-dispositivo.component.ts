import { Component } from '@angular/core';
import { DispositivoService } from 'src/serviceInfo/dispositivo.service';

@Component({
  selector: 'app-adicionar-dispositivo',
  templateUrl: './adicionar-dispositivo.component.html',
  styleUrls: ['./adicionar-dispositivo.component.css']
})
export class AdicionarDispositivoComponent {
  
    constructor(private dispositivoService : DispositivoService) { }

    add(codigo: string,
      nickname: string,
      idTipoDispositivo: string,
      numeroSerie: string,
      descricao: string): void {
      
      
    this.dispositivoService.adicionarDispositivoAFrota(codigo, nickname, idTipoDispositivo, numeroSerie, descricao);
  }
}

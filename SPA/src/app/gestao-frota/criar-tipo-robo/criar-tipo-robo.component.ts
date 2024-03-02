import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoRoboService } from 'src/serviceInfo/tipo-robo.service';

@Component({
  selector: 'app-criar-tipo-robo',
  templateUrl: './criar-tipo-robo.component.html',
  styleUrls: ['./criar-tipo-robo.component.css']
})
export class CriarTipoRoboComponent {
  constructor(private tipoRoboService: TipoRoboService) {}
  listaTipoTarefa = [
    { id: 1, label: 'Vigilância', selected: false },
    { id: 2, label: 'PickUp/Delivery', selected: false },
  ];
  listaTipoTarefaSelecionados: string[] = [];
  add(marca:string, modelo:string): void {
    this.listaTipoTarefaSelecionados = [];
    for(let i = 0; i < this.listaTipoTarefa.length; i++){
      if(this.listaTipoTarefa[i].selected === true){
        this.listaTipoTarefaSelecionados.push(this.listaTipoTarefa[i].label);
      }
    }
    this.tipoRoboService.criarTipoRobo(this.listaTipoTarefaSelecionados, marca, modelo);

  }
}

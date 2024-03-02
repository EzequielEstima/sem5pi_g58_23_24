import { Component } from '@angular/core';
import Tarefa from 'src/dataModel/tarefa';
import { DispositivoService } from 'src/serviceInfo/dispositivo.service';
import { TarefaService } from 'src/serviceInfo/tarefa.service';

@Component({
  selector: 'app-listar-tarefas-pendentes',
  templateUrl: './listar-tarefas-pendentes.component.html',
  styleUrls: ['./listar-tarefas-pendentes.component.css']
})
export class ListarTarefasPendentesComponent {
  constructor(private tarefaService: TarefaService, private dispositivoService: DispositivoService) { }
  listaTarefas: Tarefa[] = [];

  ngOnInit(): void {  
    this.tarefaService.getTarefasPendentes().subscribe({
      next: data => {
        this.listaTarefas = data;
        console.log(this.listaTarefas);
      }
    });
  }
}

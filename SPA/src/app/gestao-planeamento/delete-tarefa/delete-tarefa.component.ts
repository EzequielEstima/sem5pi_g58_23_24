import { Component } from '@angular/core';
import { TarefaService } from 'src/serviceInfo/tarefa.service';

@Component({
  selector: 'app-delete-tarefa',
  templateUrl: './delete-tarefa.component.html',
  styleUrls: ['./delete-tarefa.component.css']
})
export class DeleteTarefaComponent {
  
    constructor(private tarefaService :TarefaService) { }

    deleteTarefa(id: string){
      this.tarefaService.deleteTarefa(id);
    }
}

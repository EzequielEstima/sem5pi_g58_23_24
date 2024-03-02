import { Component } from '@angular/core';
import { TarefaService } from 'src/serviceInfo/tarefa.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import Tarefa from 'src/dataModel/tarefa';
import { Router } from '@angular/router';

@Component({
  selector: 'app-obter-tarefa',
  templateUrl: './obter-tarefa.component.html',
  styleUrls: ['./obter-tarefa.component.css']
})

export class ObterTarefaComponent {

  constructor(private tarefaService: TarefaService,private router: Router) { }

  selectedCriteria: string | null = null; 
  selectedValue: string | null = null;
  listaTarefas: Tarefa[] | null = [];
  tarefasPlaneadas: boolean = false;

  changeValue(email: string){
    this.selectedValue = email;
  }

  add(): void {
    this.tarefasPlaneadas = false;
    console.log(this.selectedCriteria);
    console.log(this.selectedValue);
    this.tarefaService.obterTarefa(this.selectedCriteria, this.selectedValue)
    .subscribe(data => {
      if (this.selectedValue === "Planeada") {
        this.tarefasPlaneadas = true;
      }
      this.listaTarefas = data;
      console.log(this.listaTarefas);
    });
  }

  v3D(id: string): void {
    console.log("ola")
    this.router.navigate(['/visualizacao3D/'+id]);
  }

}

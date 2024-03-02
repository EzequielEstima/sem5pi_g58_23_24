import { Component } from '@angular/core';
import Tarefa from 'src/dataModel/tarefa';
import { DispositivoService } from 'src/serviceInfo/dispositivo.service';
import { TarefaService } from 'src/serviceInfo/tarefa.service';

@Component({
  selector: 'app-aprovar-tarefa',
  templateUrl: './aprovar-tarefa.component.html',
  styleUrls: ['./aprovar-tarefa.component.css']
})
export class AprovarTarefaComponent {
  

  constructor(private tarefaService: TarefaService, private dispositivoService: DispositivoService) { }
  listaTarefas: Tarefa[] = [];
  listaRobos: string[] = [];
  existeRobo: boolean = false;
  idTarefa: string = "";

  ngOnInit(): void {  
    this.tarefaService.getTarefasPendentes().subscribe({
      next: data => {
        this.listaTarefas = data;
        console.log(this.listaTarefas);
      }
    });
  }

  obterRobo(tipoTarefa: string, idTarefa: string){
    this.existeRobo = true;
    this.idTarefa = idTarefa;
    this.dispositivoService.listarCodigoDosDispositivosDaFrotaPorTarefa()
    .subscribe({
      next: data => {
        if(tipoTarefa == "Vigilancia"){
          this.listaRobos = data.dispositivosVigilancia;
        }else{
          this.listaRobos = data.dispositivosPickup;
        }  
      },
      error: error => {
        this.listaRobos = [];
        this.existeRobo = false;
        this.idTarefa = ""; 

      }});
  }

  alterarEstadoDaTarefa(idTarefa: string, estado: string, codigoRobo: string): void{
    this.tarefaService.alterarEstadoTarefa(idTarefa, estado, codigoRobo);
    this.listaRobos = [];
    this.existeRobo = false;
  }

  resetPopup(){
    this.listaRobos = [];
    this.existeRobo = false;
    this.idTarefa = ""; 
  }

}

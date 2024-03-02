import { Component } from '@angular/core';
import { PlanearTarefas } from '../../../dataModel/planearTarefas';
import { TarefaService } from 'src/serviceInfo/tarefa.service';
import { MessageService } from 'src/serviceInfo/message.service';
import { Plane } from 'three';
import { PlaneamentoService } from 'src/serviceInfo/planeamento.service';
import { MapaService } from 'src/serviceInfo/mapa.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-planeamento-tarefas',
  templateUrl: './planeamento-tarefas.component.html',
  styleUrls: ['./planeamento-tarefas.component.css']
})
export class PlaneamentoTarefasComponent {

  rotas: PlanearTarefas[] = [];
  flag: boolean = false;

  constructor(private tarefasService: TarefaService,private mapaService: MapaService, private router: Router) { }

  carregarMapa(): void {
    this.mapaService.exportarMapaParaOPlaneamento();
  }

  planearTarefas(algoritmo: number): void {
    this.rotas = [];
    
    this.tarefasService.planearTarefas(algoritmo).subscribe({
      next: data => {
        console.log(data);
        if (data != null && data != undefined) {
          for (let i = 0; i < data.length; i++) {
            let plano: PlanearTarefas = {
              codDispositivo: "",
              tarefas: []
            };
            plano.codDispositivo = data[i].codDispositivo;
            for (let j = 0; j < data[i].tarefas.length; j++) {
              let strsplit = data[i].tarefas[j].split("---");
              let tarefa;
              if (strsplit[0] == "Vigilancia" ){
                tarefa = {
                  tipoTarefa: strsplit[0],
                  id: strsplit[1],
                  emailRequisitor: strsplit[2],
                  codEdificio: strsplit[3],
                  numeroPiso: parseInt(strsplit[4])
                }
              }else{
                tarefa = {
                  tipoTarefa: strsplit[0],
                  id: strsplit[1],
                  emailRequisitor: strsplit[2],
                  salaInicial: strsplit[3],
                  salaFinal: strsplit[4],
                }
              }
              plano.tarefas.push(tarefa);
            }
            this.rotas.push(plano);
          }
        
        }
      }
    });    
  }

  v3D(id: string): void {
    this.router.navigate(['/visualizacao3D/'+id])
  }
  toArray(answers: { [key: string]: any }) {
    return Object.keys(answers).map(key => answers[key]);
  }
  
}

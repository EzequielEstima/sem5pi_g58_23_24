import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Elevador } from 'src/dataModel/elevador';
import { ListarElevador } from 'src/dataModel/listarElevador';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { ElevadorService } from 'src/serviceInfo/elevador.service';

@Component({
  selector: 'app-listar-elevador',
  templateUrl: './listar-elevador.component.html',
  styleUrls: ['./listar-elevador.component.css']
})
export class ListarElevadorComponent implements OnInit {

  listaCodigosEd: string[] = [];
  listaElevadores: ListarElevador[] = [];
  myForm!: FormGroup;

  constructor(
    private elevadorService: ElevadorService,
    private edificioService: EdificioService,
    private fb: FormBuilder
    ) { }

  
  public ngOnInit(): void {  
    this.edificioService.listarCodEdificios().subscribe({
      next: data => {
        this.listaCodigosEd = data;
      }
    });

    this.myForm = this.fb.group({
      codigo: ['', Validators.required],
    });
  }

  listarElevador(): void {
    const codigo = this.myForm.get('codigo')?.value;
    this.elevadorService.listarElevador(codigo).subscribe({
      next : data => {
        let aux: ListarElevador[] = [];
        
        if(data !== undefined){
          aux.push(data);
        }
        
        this.listaElevadores = aux;
      }
    });
  }

}

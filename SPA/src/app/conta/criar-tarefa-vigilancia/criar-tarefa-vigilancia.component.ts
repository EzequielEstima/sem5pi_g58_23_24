import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { PisoService } from 'src/serviceInfo/piso.service';
import { TarefaService } from 'src/serviceInfo/tarefa.service';

@Component({
  selector: 'app-criar-tarefa-vigilancia',
  templateUrl: './criar-tarefa-vigilancia.component.html',
  styleUrls: ['./criar-tarefa-vigilancia.component.css']
})
export class CriarTarefaVigilanciaComponent {

  myForm!: FormGroup;
  listaCodEdificios!: string[];
  listaNumeroPisos!: number[];

  constructor(private fb: FormBuilder,
              private tarefaService: TarefaService,
              private edificioService: EdificioService,
              private pisoService: PisoService){
  }

  ngOnInit() : void {

    this.edificioService.listarCodEdificios().subscribe({
      next: data => {
        this.listaCodEdificios = data;
      }
    });

    this.myForm = this.fb.group({
      nomeVigilancia: ['', Validators.required],
      numeroVigilancia: ['', Validators.required],
      codigoEd: ['', Validators.required],
      numeroPiso: ['', Validators.required],
    });
  }

  public listarNumeroPisos(): void {
    
    const codigo = this.myForm.get('codigoEd')?.value;

    // Reset à lista de pisos selecionados
    this.myForm.controls['numeroPiso'].reset()
    
    this.pisoService.listarNumeroPisos(codigo).subscribe({
      next: data => {
        let aux: number[] = [];
        for (let i = 0; i < data.length; i++) {
          aux.push(data[i]);
        }
        this.listaNumeroPisos = aux;
      },error: error => {
        // Quando não existem pisos no edifício dá reset à lista de pisos da dropdown
        this.listaNumeroPisos = [];
      }
    });
  }

  public criarTarefaVigilancia(): void {
    const nome = this.myForm.get('nomeVigilancia')?.value;
    const numero = this.myForm.get('numeroVigilancia')?.value;
    const codigo = this.myForm.get('codigoEd')?.value;
    const numeroPiso = this.myForm.get('numeroPiso')?.value;

    this.tarefaService.criarTarefaVigilancia(nome, numero, codigo, numeroPiso);
  }
}

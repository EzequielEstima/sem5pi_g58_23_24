import { Component } from '@angular/core';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { PassagemService } from 'src/serviceInfo/passagem.service';
import { PisoService } from 'src/serviceInfo/piso.service';

@Component({
  selector: 'app-editar-passagem',
  templateUrl: './editar-passagem.component.html',
  styleUrls: ['./editar-passagem.component.css']
})
export class EditarPassagemComponent {

  constructor(
    private pisoService: PisoService,
    private passagemService: PassagemService, 
    private edificioService: EdificioService,
    ) {}

    listaCodigos: string[] = [];
    listaNumeroPisosA: number[] = [];
    listaNumeroPisosB: number[] = [];

  ngOnInit(): void {  
    this.edificioService.listarCodEdificios().subscribe({
      next: data => {
        this.listaCodigos = data;
      }
    });  }

  listarNumeroPisosA(codigoEdificioInput: string): void {
    const codigo = codigoEdificioInput
    if(codigo == ""){this.listaNumeroPisosA = []}
    else{this.pisoService.listarNumeroPisos(codigo).subscribe(pisos => this.listaNumeroPisosA = pisos);}
  }
  listarNumeroPisosB(codigoEdificioInput: string): void {
    const codigo = codigoEdificioInput
    if(codigo == ""){this.listaNumeroPisosB = []}
    else{this.pisoService.listarNumeroPisos(codigo).subscribe(pisos => this.listaNumeroPisosB = pisos);}
  }

  editarPassagem(id: number, codigoEdificioA: string, codigoEdificioB: string, numeroPisoA: number, numeroPisoB: number): void {
    this.passagemService.editarPassagem(id, codigoEdificioA, codigoEdificioB, numeroPisoA, numeroPisoB);
  }
}


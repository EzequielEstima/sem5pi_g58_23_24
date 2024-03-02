import { Component, OnInit } from '@angular/core';
import { PisoService } from '../../../serviceInfo/piso.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-piso',
  templateUrl: './editar-piso.component.html',
  styleUrls: ['./editar-piso.component.css']
})
export class EditarPisoComponent implements OnInit {

  myForm!: FormGroup;
  listaCodigos: string[] = [];
  listaNumeroPisos: number[] = [];

  constructor(
    private pisoService: PisoService,
    private edificioService: EdificioService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {  

    this.edificioService.listarCodEdificios().subscribe({
      next: data => {
        this.listaCodigos = data;
      }
    });
  
    this.myForm = this.fb.group({
      codigo: ['', Validators.required],
      numeroPiso: ['', Validators.required],
      novoNumeroPiso: [''],
      descricaoPiso: ['']
    });

  }

  listarNumeroPisos(): void {
    const codigo = this.myForm.get('codigo')?.value;
  
    if (codigo === "") {
      this.listaNumeroPisos = [];
    } else {
      this.pisoService.listarNumeroPisos(codigo).subscribe({
        next: data => {
          this.listaNumeroPisos = data;
        },
        error: error => {
          console.error('Error fetching floor numbers:', error);
        },
        complete: () => {
        }
      });
    }
  }

  editarPiso(): void {
    const codigo = this.myForm.get('codigo')?.value;
    const numeroPiso = this.myForm.get('numeroPiso')?.value;
    const novoNumeroPiso = this.myForm.get('novoNumeroPiso')?.value;
    const descricaoPiso = this.myForm.get('descricaoPiso')?.value;
      
    this.pisoService.editarPiso(codigo, numeroPiso, novoNumeroPiso, descricaoPiso);
  }

}
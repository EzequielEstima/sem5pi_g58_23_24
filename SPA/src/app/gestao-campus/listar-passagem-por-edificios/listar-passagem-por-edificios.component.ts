import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListarPassagem } from 'src/dataModel/listarPassagem';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { PassagemService } from 'src/serviceInfo/passagem.service';

@Component({
  selector: 'app-listar-passagem-por-edificios',
  templateUrl: './listar-passagem-por-edificios.component.html',
  styleUrls: ['./listar-passagem-por-edificios.component.css']
})
export class ListarPassagemPorEdificiosComponent implements OnInit {

  listaCodigosEd: string[] = [];
  listaPassagens: ListarPassagem[] = [];
  myForm!: FormGroup;

  constructor(
    private edificioService: EdificioService,
    private passagemService: PassagemService,
    private fb: FormBuilder
    ) { }


  ngOnInit(): void {
    this.edificioService.listarCodEdificios().subscribe({
      next: data => {
        this.listaCodigosEd = data;
      }
    });
    this.myForm = this.fb.group({
      cod1: ['', Validators.required],
      cod2: ['', Validators.required],
    });
  }

  public listarPassagensPorEdificios() {
    const cod1 = this.myForm.get('cod1')?.value;
    const cod2 = this.myForm.get('cod2')?.value;

    this.passagemService.listarPassagensPorEdificios(cod1, cod2).subscribe({
      next: data => {
        this.listaPassagens = data;
      },
      error: error => {
        this.listaPassagens = [];
      }
    });
  }
    
}

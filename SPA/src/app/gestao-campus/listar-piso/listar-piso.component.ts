import { Component, OnInit } from '@angular/core';
import { PisoService } from '../../../serviceInfo/piso.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { Piso } from 'src/dataModel/piso';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-listar-piso',
  templateUrl: './listar-piso.component.html',
  styleUrls: ['./listar-piso.component.css']
})
export class ListarPisoComponent implements OnInit{

  listaCodigos: string[] = [];
  listaPisos: Piso[] = [];
  myForm!: FormGroup;

  constructor(private pisoService: PisoService,
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
    });
  }

  listarPiso(): void {
    const codigo = this.myForm.get('codigo')?.value;
    this.pisoService.listarPisos(codigo).subscribe(
      data => {
        this.listaPisos = data;
      },
    );
  }

}

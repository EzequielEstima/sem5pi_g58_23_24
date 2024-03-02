import { Component } from '@angular/core';
import { EdificioService } from 'src/serviceInfo/edificio.service';

@Component({
  selector: 'app-editar-edificio',
  templateUrl: './editar-edificio.component.html',
  styleUrls: ['./editar-edificio.component.css']
})
export class EditarEdificioComponent {
  constructor(private edificioService: EdificioService) {}
  listaCodigos: string[] = [];

  ngOnInit(): void {  
    this.edificioService.listarCodEdificios().subscribe({
      next: data => {
        this.listaCodigos = data;
      }
    });
  }
  edit(codigo:string, nome?:string, descricao?:string): void {
    this.edificioService.editarEdificio(codigo, nome, descricao);
  }
}

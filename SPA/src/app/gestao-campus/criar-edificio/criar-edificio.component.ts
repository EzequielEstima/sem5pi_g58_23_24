import { Component } from '@angular/core';
import { EdificioService } from 'src/serviceInfo/edificio.service';

@Component({
  selector: 'app-criar-edificio',
  templateUrl: './criar-edificio.component.html',
  styleUrls: ['./criar-edificio.component.css']
})
export class CriarEdificioComponent {
  constructor(private edificioService: EdificioService) {}
  add(codigo:string, dimensaoX:string, dimensaoY:string, nome?:string, descricao?:string): void {
    this.edificioService.criarEdificio(codigo, dimensaoX, dimensaoY, nome, descricao);
  }
}


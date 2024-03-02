import { Component } from '@angular/core';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { PassagemService } from 'src/serviceInfo/passagem.service';

@Component({
  selector: 'app-criar-passagem',
  templateUrl: './criar-passagem.component.html',
  styleUrls: ['./criar-passagem.component.css']
})
export class CriarPassagemComponent {

  constructor(private passagemService: PassagemService, private edificioService: EdificioService) {}

  listaCodigos: string[] = [];

  ngOnInit(): void {  
    this.edificioService.listarCodEdificios().subscribe({
      next: data => {
        this.listaCodigos = data;
      }
    });
  }

  add(id: number, codigoEdificioA: string, codigoEdificioB: string, numeroPisoA: number, numeroPisoB: number): void {
    this.passagemService.criarPassagem(id, codigoEdificioA, codigoEdificioB, numeroPisoA, numeroPisoB);
  }
}


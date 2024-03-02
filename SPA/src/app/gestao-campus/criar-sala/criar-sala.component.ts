import { Component } from '@angular/core';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { SalaService } from 'src/serviceInfo/sala.service';

@Component({
  selector: 'app-criar-sala',
  templateUrl: './criar-sala.component.html',
  styleUrls: ['./criar-sala.component.css']
})
export class CriarSalaComponent {

  constructor(private salaService: SalaService, private edificioService: EdificioService) {}

  listaCodigos: string[] = [];

  ngOnInit(): void {  
    this.edificioService.listarCodEdificios().subscribe({
      next: data => {
        this.listaCodigos = data;
      }
    });
  }

  onCodigoChange(selectedCodigo: string) {
    // Aquí puedes manejar el código seleccionado    
    // Realiza otras acciones según sea necesario
  }

  add(id: string, codigoEdificio: string, numeroPiso: number, descricao: string, categoria: string): void {
    this.salaService.criarSala(id, codigoEdificio, numeroPiso, descricao, categoria);
  }
}


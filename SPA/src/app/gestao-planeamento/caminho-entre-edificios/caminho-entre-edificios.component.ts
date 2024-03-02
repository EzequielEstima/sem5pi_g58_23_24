import { Component } from '@angular/core';
import { PlaneamentoService } from 'src/serviceInfo/planeamento.service';

@Component({
  selector: 'app-caminho-entre-edificios',
  templateUrl: './caminho-entre-edificios.component.html',
  styleUrls: ['./caminho-entre-edificios.component.css']
})
export class CaminhoEntreEdificiosComponent {

  constructor(private planeamentoService: PlaneamentoService) { }

  encontrar_caminhos(salaInicial: string, salaFinal: string){
    this.planeamentoService.encontrar_caminhos(salaInicial, salaFinal);
  }

}

import { Component } from '@angular/core';
import { ContaService } from 'src/serviceInfo/conta.service';

@Component({
  selector: 'app-exportar-dados-pessoais',
  templateUrl: './exportar-dados-pessoais.component.html',
  styleUrls: ['./exportar-dados-pessoais.component.css']
})
export class ExportarDadosPessoaisComponent {
  constructor(private contaService : ContaService) { }
  export(): void {
    this.contaService.exportarDadosPessoais().subscribe(dadosPessoais =>{
      if(dadosPessoais === null || dadosPessoais === undefined){
        return;
      }
      const blob = new Blob([JSON.stringify(dadosPessoais)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'DadosPessoais.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}

import { Component } from '@angular/core';
import { PisoService } from '../../../serviceInfo/piso.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { FormBuilder} from '@angular/forms';
import { PassagemService } from 'src/serviceInfo/passagem.service';

interface TabelaInfo {
  idPassagem: string;
  passagem: string;
  pisoInfo: string;
  edificio: string;
}

@Component({
  selector: 'app-listar-piso-passagem',
  templateUrl: './listar-piso-passagem.component.html',
  styleUrls: ['./listar-piso-passagem.component.css']
})
export class ListarPisoPassagemComponent{

  constructor(private pisoService: PisoService,
    private edificioService: EdificioService,
    private passagemService: PassagemService,
    private fb: FormBuilder
    ) { }

  tabelaInfo : TabelaInfo[] = [];

  ngOnInit(): void {  
    this.passagemService.listarPisoComPassagem().subscribe({
      next: data => {
        this.tabelaInfo = data;
      }
    });
  }

  listarPiso(): void {
   
  }

}

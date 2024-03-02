import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { ElevadorService } from 'src/serviceInfo/elevador.service';
import { PisoService } from 'src/serviceInfo/piso.service';

@Component({
  selector: 'app-criar-elevador',
  templateUrl: './criar-elevador.component.html',
  styleUrls: ['./criar-elevador.component.css']
})
export class CriarElevadorComponent {
  
  listaCodEd: string[] = [];

  listaNumeroPisos: {item_id: number, item_text: string}[] = [];

  listaNumeroPisosSelecionados: {item_id: number, item_text: string}[] = [];
  
  dropdownSettings:IDropdownSettings={};
  
  myForm!: FormGroup;

  constructor(
    private edificioService: EdificioService, 
    private pisoService: PisoService,
    private elevadorService: ElevadorService,
    private fb: FormBuilder
    ) 
    { }

  ngOnInit() : void {

    this.edificioService.listarCodEdificios().subscribe({
      next: data => {
        this.listaCodEd = data;
      }
    });

    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: true,
      selectAllText: 'Selecionar todos',
      unSelectAllText: 'Selecionar todos',
      noDataAvailablePlaceholderText: "Não existem pisos disponíveis",
    };

    this.myForm = this.fb.group({
      codigo: ['', Validators.required],
      pisosServidos: ['', Validators.required],
      marca: [''],
      modelo: [''],
      numeroSerie: [''],
      descricao: ['']
    });

  }

  /**
   * Coloca a lista os pisos de um edifício no field listaNumeroPisos, com base no código do edifício selecionado
   */
  public listarNumeroPisos(): void {
    
    const codigo = this.myForm.get('codigo')?.value;

    // Reset à lista de pisos selecionados
    this.myForm.controls['pisosServidos'].reset()
    
    this.pisoService.listarNumeroPisos(codigo).subscribe({
      next: data => {
        let aux: {item_id: number, item_text: string}[] = [];
        for (let i = 0; i < data.length; i++) {
          aux.push({item_id: data[i], item_text: data[i].toString()});
        }
        this.listaNumeroPisos = aux;
      },error: error => {
        // Quando não existem pisos no edifício dá reset à lista de pisos da dropdown
        this.listaNumeroPisos = [];
      }
    });
  }

  public criarElevador(): void {
    const codigo = this.myForm.get('codigo')?.value;

    const pisosServidos : number[] =[];
    for (let i = 0; i < this.listaNumeroPisosSelecionados.length; i++) {
      pisosServidos.push(Number(this.listaNumeroPisosSelecionados[i].item_text));
    }
    /* 
    Campos opcionais
    Caso não sejam preenchidos, o valor é ""
    */
    const marca = this.myForm.get('marca')?.value;
    const modelo = this.myForm.get('modelo')?.value;
    const numeroSerie = this.myForm.get('numeroSerie')?.value;
    const descricao = this.myForm.get('descricao')?.value;
    
    this.elevadorService.criarElevador(codigo, pisosServidos, marca, modelo, numeroSerie, descricao);
  }
}

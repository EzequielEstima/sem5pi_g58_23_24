import { Component } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { TarefaService } from 'src/serviceInfo/tarefa.service';

@Component({
  selector: 'app-criar-tarefa-pick-up-delivery',
  templateUrl: './criar-tarefa-pick-up-delivery.component.html',
  styleUrls: ['./criar-tarefa-pick-up-delivery.component.css']
})
export class CriarTarefaPickUpDeliveryComponent {
  
  myForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private tarefaService: TarefaService){
  }

  ngOnInit() : void {

    this.myForm = this.fb.group({
      codConf: ['', Validators.required],
      desc: ['', Validators.required],
      nomePickUp: ['', Validators.required],
      numeroPickUp: ['', Validators.required],
      nomeDelivery: ['', Validators.required],
      numeroDelivery: ['', Validators.required],
      salaInicial: ['', Validators.required],
      salaFinal: ['', Validators.required],
    });
  }


  public criarTarefaPickUpDelivery(): void {

    const codConf = this.myForm.get('codConf')?.value;
    const desc = this.myForm.get('desc')?.value;
    const nomePickup = this.myForm.get('nomePickUp')?.value;
    const numeroPickup = this.myForm.get('numeroPickUp')?.value;
    const nomeDelivery = this.myForm.get('nomeDelivery')?.value;
    const numeroDelivery = this.myForm.get('numeroDelivery')?.value;
    const salaInicial = this.myForm.get('salaInicial')?.value;
    const salaFinal = this.myForm.get('salaFinal')?.value;

    this.tarefaService.criarTarefaPickUpDelivery(codConf, desc, nomePickup, numeroPickup, nomeDelivery, numeroDelivery, salaInicial, salaFinal);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaPrivacidadeComponent } from './politica-privacidade.component';
import { AppRoutingModule } from '../app-routing.module';

describe('PoliticaPrivacidadeComponent', () => {
  let component: PoliticaPrivacidadeComponent;
  let fixture: ComponentFixture<PoliticaPrivacidadeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoliticaPrivacidadeComponent,
      ],
      // Other configurations...
    }).compileComponents();
    fixture = TestBed.createComponent(PoliticaPrivacidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

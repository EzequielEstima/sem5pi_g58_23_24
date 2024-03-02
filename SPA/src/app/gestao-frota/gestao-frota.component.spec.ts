import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoFrotaComponent } from './gestao-frota.component';
import { SidebarFrotaComponent } from './sidebar-frota/sidebar-frota.component';
import { AuthService } from 'src/serviceInfo/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GestaoFrotaComponent', () => {
  let component: GestaoFrotaComponent;
  let fixture: ComponentFixture<GestaoFrotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestaoFrotaComponent, SidebarFrotaComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(GestaoFrotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

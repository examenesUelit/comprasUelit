import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioslistasComponent } from './usuarioslistas.component';

describe('UsuarioslistasComponent', () => {
  let component: UsuarioslistasComponent;
  let fixture: ComponentFixture<UsuarioslistasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioslistasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioslistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

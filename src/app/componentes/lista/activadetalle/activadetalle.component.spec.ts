import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivadetalleComponent } from './activadetalle.component';

describe('ActivadetalleComponent', () => {
  let component: ActivadetalleComponent;
  let fixture: ComponentFixture<ActivadetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivadetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivadetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

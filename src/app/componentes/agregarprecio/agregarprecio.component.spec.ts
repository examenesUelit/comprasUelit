import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarprecioComponent } from './agregarprecio.component';

describe('AgregarprecioComponent', () => {
  let component: AgregarprecioComponent;
  let fixture: ComponentFixture<AgregarprecioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarprecioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarprecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

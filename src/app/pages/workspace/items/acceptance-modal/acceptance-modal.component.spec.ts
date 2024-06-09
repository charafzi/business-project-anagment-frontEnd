import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceModalComponent } from './acceptance-modal.component';

describe('AcceptanceModalComponent', () => {
  let component: AcceptanceModalComponent;
  let fixture: ComponentFixture<AcceptanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptanceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

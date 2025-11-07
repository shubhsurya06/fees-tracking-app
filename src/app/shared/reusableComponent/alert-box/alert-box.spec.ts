import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertBox } from './alert-box';

describe('AlertBox', () => {
  let component: AlertBox;
  let fixture: ComponentFixture<AlertBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

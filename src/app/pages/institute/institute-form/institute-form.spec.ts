import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteForm } from './institute-form';

describe('InstituteForm', () => {
  let component: InstituteForm;
  let fixture: ComponentFixture<InstituteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

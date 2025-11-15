import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolAdv } from './enrol-adv';

describe('EnrolAdv', () => {
  let component: EnrolAdv;
  let fixture: ComponentFixture<EnrolAdv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolAdv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolAdv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

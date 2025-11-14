import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleError } from './role-error';

describe('RoleError', () => {
  let component: RoleError;
  let fixture: ComponentFixture<RoleError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

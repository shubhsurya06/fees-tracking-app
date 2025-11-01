import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageMaster } from './package-master';

describe('PackageMaster', () => {
  let component: PackageMaster;
  let fixture: ComponentFixture<PackageMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

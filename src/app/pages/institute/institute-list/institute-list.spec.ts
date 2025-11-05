import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteList } from './institute-list';

describe('InstituteList', () => {
  let component: InstituteList;
  let fixture: ComponentFixture<InstituteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituteList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

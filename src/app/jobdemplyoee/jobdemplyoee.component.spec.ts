import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobdemplyoeeComponent } from './jobdemplyoee.component';

describe('JobdemplyoeeComponent', () => {
  let component: JobdemplyoeeComponent;
  let fixture: ComponentFixture<JobdemplyoeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobdemplyoeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobdemplyoeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

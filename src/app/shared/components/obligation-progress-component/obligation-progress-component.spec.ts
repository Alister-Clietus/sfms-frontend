import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligationProgressComponent } from './obligation-progress-component';

describe('ObligationProgressComponent', () => {
  let component: ObligationProgressComponent;
  let fixture: ComponentFixture<ObligationProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObligationProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObligationProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

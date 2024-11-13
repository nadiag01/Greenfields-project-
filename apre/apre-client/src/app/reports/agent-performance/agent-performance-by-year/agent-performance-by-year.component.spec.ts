import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPerformanceByYearComponent } from './agent-performance-by-year.component';

describe('AgentPerformanceByYearComponent', () => {
  let component: AgentPerformanceByYearComponent;
  let fixture: ComponentFixture<AgentPerformanceByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPerformanceByYearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentPerformanceByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



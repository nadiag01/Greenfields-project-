
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ChartComponent } from '../../../shared/chart/chart.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agent-performance-by-year',
  standalone: true,
  imports: [ReactiveFormsModule, ChartComponent],
  template: `
      <h1>Agent Performance By Year</h1>
      < div class="year-container">
        <form class="form" [formGroup]="yearForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
            <label class="label" for="Year">Performance Year<span class="required">*</span></label>
            <select class="select" formControlName="Year" id="Year" name="Year">
            @for(year of year; track year) {
              <option value="{{ year}}">{{ year }}</option>
            }
          </select>
        </div>

        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      @if (showChart) {
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Agent Performance'"
            [data]="resolutionTime"
            [labels]="agents">
          </app-chart>
        </div>
      }

  `,
  styles: `
 .year-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
    }
  `
})
export class AgentPerformanceByYearComponent implements AfterViewInit{
  year: string[] = []; // Initially empty
  resolutionTime: number[] = []; // Initially empty
  agents: string[] = []; // Initially empty
  showChart: boolean = false; // Initially hidden

  yearForm = this.fb.group({
    year: [null, Validators.compose([Validators.required])]
  });


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
 // Query to get the years
 this.http.get(`${environment.apiBaseUrl}/reports/agent-performance/agent-performance-by-year`).subscribe({
  next: (data: any) => {
    this.year= data;
  },
  error: (err) => {
    console.error('Error fetching years:', err);
  }
});
}

ngAfterViewInit(): void {

}

onSubmit() {
// Get the value ​​of the field in the form
const year = this.yearForm.controls['year'].value;

// Check if there is any value in the supervisor field
if(year) {
  // Query that finds sales associated with the obtained year
  this.http.get(`${environment.apiBaseUrl}/reports/agent-performance/agent-performance-by-year/${year}`).subscribe({
    next: (data: any) => {
      // Set the values obtained
      this.resolutionTime = data[0].resolutionsTime;
      this.agents = data[0].agents;
    },
    error: (error: any) => {
      console.error('Error fetching agent performance by year data:', error);
    },
    complete: () => {
      this.showChart = true; // Show chart after fetching data
    }
  });
} else {
  // If there is no value in the year field, an alert is generated to prompt the user to select one.
  alert('Please select a year.');
}
}

}


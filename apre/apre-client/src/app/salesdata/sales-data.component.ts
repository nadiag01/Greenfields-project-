
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartComponent } from '../shared/chart/chart.component';
import { ChangeDetectorRef } from '@angular/core';
import { AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-sales-data',
  standalone: true,
  imports: [ReactiveFormsModule, ChartComponent],
  template: `
    <h1>Sales Data</h1>
    <div class="salesdata-container">
      <form class="form" [formGroup]="salesdataForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="salesdata">Sales Data</label>
          <select class="select" formControlName="salesdata" id="sales" name="sales">
            @for( sale of sales; track sale) {
              <option value="{{ sale }}">{{ sale }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      @if (totalSales.length && salesPeople.length) {
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Sales Data'"
            [data]="totalSales"
            [labels]="salesPeople">
          </app-chart>
        </div>
      }
    </div>
  `,
  styles: [`
    .region-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
    }
  `]
})
export class SalesdataComponent implements AfterViewInit {
  totalSales: number[] = [];
  salesPeople: string[] = [];
  regions: string[] = [];

  regionForm = this.fb.group({
    region: [null, Validators.compose([Validators.required])]
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.http.get(`${environment.apiBaseUrl}/reports/sales/regions`).subscribe({
      next: (data: any) => {
        this.regions = data;
      },
      error: (err) => {
        console.error('Error fetching regions:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    // No need to create chart here, it will be handled by ChartComponent
  }

  onSubmit() {
    const region = this.regionForm.controls['region'].value;
    this.http.get(`${environment.apiBaseUrl}/reports/sales/regions/${region}`).subscribe({
      next: (data: any) => {
        this.totalSales = data.map((s: any) => s.totalSales);
        this.salesPeople = data.map((s: any) => s.salesperson);

        console.log('totalSales', this.totalSales);
        console.log('salesPeople', this.salesPeople);

        // Trigger change detection
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      }
    });
  }
}

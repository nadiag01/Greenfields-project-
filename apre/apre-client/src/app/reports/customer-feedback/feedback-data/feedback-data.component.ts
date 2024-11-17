

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { ChartComponent } from '../../../shared/chart/chart.component';

@Component({
  selector: 'app-feedback-data',
  standalone: true,
  imports: [ReactiveFormsModule, ChartComponent],
  template: `
    <h1>Customer Feedback</h1>
    <div class="feedback-data-container">
      <form class="form" [formGroup]="feedbackForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="feedbackdata">Feedback Data/label>
          <select class="select" formControlName="feedbackdata" id="feedbackdata" name="feedbackdata">
        @for ( feedback of feedbackdata; track feedback)
            <option [value]="feedback">{{ feedbackdata }}</option>
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      <!-- Display chart only if data is available -->
      @if (feedbackRatings.length && feedbackTitles.length) {
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Customer Feedback Ratings'"
            [data]="feedbackRatings"
            [labels]="feedbackTitles">
          </app-chart>
        </div>
      }
        </div>


  `,
  styles: [`
    .feedback-container {
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
export class FeedbackDataComponent implements AfterViewInit {
  feedbackRatings: number[] = [];  // Store feedback ratings
  feedbackTitles: string[] = [];    // Store feedback titles (or customers)
  feedbackCategories: string[] = []; // Store the list of feedback categories

  feedbackForm = this.fb.group({
    feedbackdata: [null, Validators.compose([Validators.required])]  // Form control for feedback category selection
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    // Fetch available feedback categories from the API
    this.http.get(`${environment.apiBaseUrl}/reports/feedback/categories`).subscribe({
      next: (data: any) => {
        this.feedbackCategories = data;  // Assuming the response is an array of feedback categories (e.g., "Product", "Service", "Delivery", etc.)
      },
      error: (err) => {
        console.error('Error fetching feedback categories:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    // Chart rendering will be handled by the ChartComponent
  }

  onSubmit() {
    const FeedbackDataComponent= this.feedbackForm.controls['feedbackCategory'].value;  // Get the selected feedback category
    this.http.get(`${environment.apiBaseUrl}/reports/feedback/${selectedCategory}`).subscribe({
      next: (data: any) => {
        // Assuming the response contains an array with feedback ratings and customer names
        this.feedbackRatings = data.map((item: any) => item.rating);  // Extract ratings
        this.feedbackTitles = data.map((item: any) => item.title);  // Extract feedback titles (could be customer names or feedback types)

        console.log('Feedback Ratings', this.feedbackRatings);
        console.log('Feedback Titles', this.feedbackTitles);

        // Trigger change detection
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching feedback data:', err);
      }
    });
  }
}

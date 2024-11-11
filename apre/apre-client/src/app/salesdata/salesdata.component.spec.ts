import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesdataComponent } from './sales-data.component';


describe('SalesdataComponent', () => {
  let component: SalesdataComponent;
  let fixture: ComponentFixture<SalesdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesdataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

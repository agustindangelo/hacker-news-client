import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { of, Subscription, Subject } from 'rxjs';
import { ItemsService } from '../../services/items.service';
import { HttpClientModule } from '@angular/common/http';
import { Story } from '../../models/Story';
import { StoryCardComponent } from '../story-card/story-card.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoryCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnDestroy {
  loading = false;
  items: Story[] = [];
  pageSize = 5;
  currentPage = 1;
  searchQuery = new FormControl('', [Validators.maxLength(50)]);
  private searchSubscription: Subscription | undefined;
  private destroy$ = new Subject<void>();
  storiesIds: number[] = [];
  totalStories = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
    this.initializeData();
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.fetchStoriesIds();
    this.fetchItems();
  }

  private setupSearchSubscription(): void {
    this.searchSubscription = this.searchQuery.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.loading = true;
        if (query) {
          this.itemsService
            .searchStories(query)
            .pipe(
              catchError((error) => {
                console.error('Error searching stories', error);
                return of([]);
              })
            )
            .subscribe((data) => {
              this.items = data;
              this.loading = false;
            });
        } else {
          this.fetchItems();
        }
      });
  }

  private fetchStoriesIds(): void {
    this.loading = true;
    this.itemsService
      .getNewestStoriesIds()
      .pipe(
        catchError((error) => {
          console.error('Error fetching story IDs', error);
          return of([]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.storiesIds = data;
        this.totalStories = data.length;
        this.loading = false;
      });
  }

  private fetchItems(): void {
    this.loading = true;
    this.itemsService
      .getStories(this.currentPage, this.pageSize)
      .pipe(
        catchError((error) => {
          console.error('Error fetching stories', error);
          return of([]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.items = data;
        this.loading = false;
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchItems();
  }
}

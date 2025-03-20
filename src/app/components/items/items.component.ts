import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  takeUntil
} from 'rxjs/operators';
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
  itemsToShow: Story[] = [];
  searchResults: Story[] = [];
  subscriptions = new Array<Subscription>();
  pageSize = 5;
  currentPage = 1;
  searchQuery = new FormControl('', [Validators.maxLength(50)]);
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
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    this.fetchStoriesIds();
    this.fetchItems(this.currentPage, this.pageSize);
  }

  private setupSearchSubscription(): void {
    this.subscriptions.push(
      this.searchQuery.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          takeUntil(this.destroy$),
          filter((query) => !!query)
        )
        .subscribe((query) => {
          this.loading = true;
          this.itemsService
            .searchStories(query!)
            .pipe(
              catchError((error) => {
                console.error('Error searching stories', error);
                return of([]);
              }),
              finalize(() => (this.loading = false))
            )
            .subscribe((data) => {
              this.searchResults = data;
              this.itemsToShow = this.searchResults.slice(0, this.pageSize);
              this.totalStories = this.searchResults.length;
              this.currentPage = 0;
            });
        })
    );

    this.subscriptions.push(
      this.searchQuery.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          takeUntil(this.destroy$),
          filter((query) => query!.length === 0)
        )
        .subscribe(() => {
          this.clearSearch();
        })
    );
  }

  private clearSearch(): void {
    this.totalStories = this.storiesIds.length;
    this.itemsToShow = this.items;
  }

  private fetchStoriesIds(): void {
    this.itemsService
      .getLatestStoriesIds()
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
      });
  }

  private fetchItems(currentPage: number, pageSize: number): void {
    this.loading = true;
    this.itemsService
      .getStories(currentPage, pageSize)
      .pipe(
        catchError((error) => {
          console.error('Error fetching stories', error);
          return of([]);
        }),
        finalize(() => (this.loading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.items = data;
        this.totalStories = this.storiesIds.length;
        this.itemsToShow = this.items.slice(0, this.pageSize);
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if (this.searchQuery.value) {
      const fromIndex = event.pageIndex * event.pageSize;
      const toIndex = fromIndex + event.pageSize;
      this.itemsToShow = this.searchResults.slice(fromIndex, toIndex);
    } else {
      this.fetchItems(this.currentPage, this.pageSize);
    }
  }
}

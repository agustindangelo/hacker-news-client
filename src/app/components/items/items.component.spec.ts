import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ItemsComponent } from './items.component';
import { ItemsService } from '../../services/items.service';
import { Story } from '../../models/Story';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ItemsComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;
  let itemsService: jasmine.SpyObj<ItemsService>;

  const dummyStories: Story[] = [
    {
      id: 1,
      title: 'Story 1',
      by: 'Author 1',
      descendants: 4,
      url: 'http://example.com/1',
      type: 'story',
      kids: [22, 13, 14, 15],
      score: 10,
      time: 1234567890
    },
    {
      id: 2,
      title: 'Story 2',
      by: 'Author 2',
      descendants: 2,
      url: 'http://example.com/2',
      type: 'story',
      kids: [12, 14],
      score: 5,
      time: 1234567090
    },
    {
      id: 3,
      title: 'Story 3',
      by: 'Author 3',
      descendants: 0,
      url: 'http://example.com/3',
      type: 'story',
      kids: [],
      score: 0,
      time: 1234567193
    }
  ];
  const dummyStoriesIds = dummyStories.map((story) => story.id);

  beforeEach(async () => {
    const itemsServiceSpy = jasmine.createSpyObj('ItemsService', [
      'getNewestStoriesIds',
      'getStories',
      'searchStories'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ItemsComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatCardModule,
        BrowserAnimationsModule
      ],
      providers: [{ provide: ItemsService, useValue: itemsServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    itemsService = TestBed.inject(ItemsService) as jasmine.SpyObj<ItemsService>;

    itemsService.getNewestStoriesIds.and.returnValue(of(dummyStoriesIds));
    itemsService.getStories.and.returnValue(of(dummyStories));
    itemsService.searchStories.and.returnValue(of(dummyStories));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch stories on initialize', () => {
    itemsService.getStories.and.returnValue(of(dummyStories));
    component.ngOnInit();
    expect(itemsService.getStories).toHaveBeenCalledWith(1, 5);
    expect(component.items.length).toBe(3);
  });

  it('should fetch items when page changes', () => {
    itemsService.getStories.and.returnValue(of(dummyStories));
    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 10 } as any);
    expect(itemsService.getStories).toHaveBeenCalledWith(2, 5);
    expect(component.items.length).toBe(3);
  });
});

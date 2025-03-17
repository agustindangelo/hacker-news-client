import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryCardComponent } from './story-card.component';
import { Story } from '../../models/Story';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('StoryCardComponent', () => {
  let component: StoryCardComponent;
  let fixture: ComponentFixture<StoryCardComponent>;
  let httpMock: HttpTestingController;

  const dummyStory: Story = {
    id: 1,
    title: 'Story 1',
    by: 'Author 1',
    descendants: 4,
    url: 'http://example.com/1',
    type: 'story',
    kids: [22, 13, 14, 15],
    score: 10,
    time: 1234567890
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatTooltipModule,
        StoryCardComponent,
        HttpClientTestingModule
      ],
      providers: []
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(StoryCardComponent);
    component = fixture.componentInstance;
    component.story = dummyStory;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display story title and link', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('.title a');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain(dummyStory.title);
    expect(titleElement.getAttribute('href')).toBe(dummyStory.url);
  });

  it('should display author and descendants', () => {
    const compiled = fixture.nativeElement;
    const authorElement = compiled.querySelector('.story-details p b');
    const descendantsElement = compiled.querySelector('.story-details a');
    expect(authorElement).toBeTruthy();
    expect(descendantsElement).toBeTruthy();
    expect(authorElement.textContent).toContain(dummyStory.by);
    expect(descendantsElement.textContent).toContain(`See ${dummyStory.descendants} comments`);
  });
});

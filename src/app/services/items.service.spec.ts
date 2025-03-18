import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemsService } from './items.service';
import { environment } from '../../environments/environment';
import { Story } from '../models/Story';

describe('ItemsService', () => {
  let service: ItemsService;
  let httpMock: HttpTestingController;
  let dummyStories: Story[] = [
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
  let dummyIds = dummyStories.map((story) => story.id);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsService]
    });
    service = TestBed.inject(ItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch newest stories ids', () => {
    service.getLatestStoriesIds().subscribe((ids) => {
      expect(ids.length).toBe(dummyStories.length);
      expect(ids).toEqual(dummyIds);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/topstories`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyIds);
  });

  it('should fetch stories', () => {
    let pageSize = 2;
    service.getStories(1, pageSize).subscribe((stories) => {
      expect(stories.length).toBe(2);
      expect(stories).toEqual(dummyStories.slice(0, pageSize));
    });

    const reqIds = httpMock.expectOne(`${environment.apiBaseUrl}/topstories`);
    expect(reqIds.request.method).toBe('GET');
    reqIds.flush(dummyIds);

    dummyIds.slice(0, pageSize).forEach((id, index) => {
      const reqStory = httpMock.expectOne(`${environment.apiBaseUrl}/items/${id}`);
      expect(reqStory.request.method).toBe('GET');
      reqStory.flush(dummyStories[index]);
    });
  });

  it('should fetch a single story', () => {
    const dummyStory = dummyStories[0];

    service.getStory(1).subscribe((story) => {
      expect(story).toEqual(dummyStory);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/items/${dummyStory.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyStory);
  });

  it('should search stories by title', () => {
    let searchInput = 'Story';
    let matchingStories = dummyStories.filter((x) => x.title.includes(searchInput));

    service.searchStories(searchInput).subscribe((stories) => {
      expect(stories.length).toBe(matchingStories.length);
      expect(stories).toEqual(matchingStories);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/items/search?title=Story`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyStories);
  });

  it('should fetch comments by ids', () => {
    const commentIds = [22, 13];
    const dummyComments = [
      { id: 22, text: 'Comment 1', by: 'User 1', time: 1234567890 },
      { id: 13, text: 'Comment 2', by: 'User 2', time: 1234567891 }
    ];

    service.getComments(commentIds).subscribe((comments) => {
      expect(comments.length).toBe(2);
      expect(comments).toEqual(dummyComments);
    });

    commentIds.forEach((id, index) => {
      const req = httpMock.expectOne(`${environment.apiBaseUrl}/items/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyComments[index]);
    });
  });
});

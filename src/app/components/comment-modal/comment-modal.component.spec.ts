import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CommentModalComponent } from './comment-modal.component';
import { ItemsService } from '../../services/items.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { UnixTimestampPipe } from '../../pipes/unix-timestamp.pipe';

describe('CommentModalComponent', () => {
  let component: CommentModalComponent;
  let fixture: ComponentFixture<CommentModalComponent>;
  let itemsService: jasmine.SpyObj<ItemsService>;

  const dummyComments = [
    { id: 22, text: 'Comment 1', by: 'User 1', time: 1234567890 },
    { id: 13, text: 'Comment 2', by: 'User 2', time: 1234567891 }
  ];

  beforeEach(async () => {
    const itemsServiceSpy = jasmine.createSpyObj('ItemsService', ['getComments']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        UnixTimestampPipe,
        CommentModalComponent
      ],
      providers: [
        { provide: ItemsService, useValue: itemsServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: { commentIds: [22, 13] } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentModalComponent);
    component = fixture.componentInstance;
    itemsService = TestBed.inject(ItemsService) as jasmine.SpyObj<ItemsService>;
    itemsService.getComments.and.returnValue(of(dummyComments));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch comments on init', () => {
    expect(itemsService.getComments).toHaveBeenCalledWith([22, 13]);
    expect(component.comments.length).toBe(2);
    expect(component.comments).toEqual(dummyComments);
  });

  it('should display comments', () => {
    const compiled = fixture.nativeElement;
    const commentElements = compiled.querySelectorAll('.comment');
    expect(commentElements.length).toBe(2);
    expect(commentElements[0].textContent).toContain('Comment 1');
    expect(commentElements[1].textContent).toContain('Comment 2');
  });

  it('should handle error when fetching comments', () => {
    itemsService.getComments.and.returnValue(of([]));
    component.fetchComments();
    expect(itemsService.getComments).toHaveBeenCalled();
    expect(component.comments.length).toBe(0);
  });
});

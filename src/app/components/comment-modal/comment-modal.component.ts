import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UnixTimestampPipe } from '../../pipes/unix-timestamp.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { ItemsService } from '../../services/items.service';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/Comment';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-comment-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, UnixTimestampPipe, MatDividerModule],
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss']
})
export class CommentModalComponent implements OnInit, OnDestroy {
  comments: Comment[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { commentIds: number[] },
    private itemsService: ItemsService
  ) {}

  ngOnInit() {
    this.fetchComments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchComments() {
    this.itemsService
      .getComments(this.data.commentIds)
      .pipe(
        catchError((error) => {
          console.error('Error fetching comments details', error);
          return of([]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((comments) => {
        this.comments = comments;
      });
  }
}

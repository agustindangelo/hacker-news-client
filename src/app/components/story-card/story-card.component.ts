import { Component, Input } from '@angular/core';
import { Story } from '../../models/Story';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommentModalComponent } from '../comment-modal/comment-modal.component';
import { UnixTimestampPipe } from '../../pipes/unix-timestamp.pipe';

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    UnixTimestampPipe
  ],
  templateUrl: './story-card.component.html',
  styleUrl: './story-card.component.scss'
})
export class StoryCardComponent {
  @Input() story!: Story;

  constructor(public dialog: MatDialog) {}

  openCommentsModal(): void {
    if (this.story.kids && this.story.kids.length > 0) {
      this.dialog.open(CommentModalComponent, {
        width: '600px',
        data: { commentIds: this.story.kids }
      });
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixTimestamp',
  standalone: true
})
export class UnixTimestampPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '';

    const date = new Date(value * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat(navigator.language, options).format(date);
  }
}

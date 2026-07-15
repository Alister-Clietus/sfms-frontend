import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'sfmsDate',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  private datePipe = new DatePipe('en-US');

  transform(value: string | Date | null | undefined, format: 'short' | 'long' = 'short'): string | null {
    if (!value) {
      return '-';
    }
    // CODE-FE-005: Consistent temporal formatting
    const formatString = format === 'long' ? 'medium' : 'MMM d, y';
    return this.datePipe.transform(value, formatString);
  }
}

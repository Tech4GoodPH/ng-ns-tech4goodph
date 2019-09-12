import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {

  transform(value: number): string {
    let newStr = '';
    if (value === 1) {
      newStr = 'Good';
    } else if (value === 0) {
      newStr = 'Bad';
    } else {
      newStr = 'Unknown';
    }
    return newStr;
  }

}

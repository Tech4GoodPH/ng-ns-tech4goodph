import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let newStr = ''
    if (value === '1') {
      newStr = 'Good'
    } else {
      newStr = 'Bad'
    }
    return newStr;
  }

}

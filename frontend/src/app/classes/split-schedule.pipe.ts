import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Pipe({
  name: 'splitSchedule'
})
export class SplitSchedulePipe implements PipeTransform {

  public transform(value: any, takeBy: number = 4, throttleTime: number = 40): Observable<Array<any>> {
    return Array.isArray(value)
      ? this.getSplittedThread(value, takeBy, throttleTime)
      : of(value);
  }

  private getSplittedThread(data: Array<any>, takeBy: number, throttleTime: number): Observable<Array<any>> {
    const repeatNumber = Math.ceil(data.length / takeBy);
    return timer(0, throttleTime).pipe(
      map((current) => data.slice(0, takeBy * ++current)),
      take(repeatNumber)
    );
  }

}

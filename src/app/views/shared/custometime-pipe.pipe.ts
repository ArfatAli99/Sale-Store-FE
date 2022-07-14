import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'customtimePipe'
})
export class CustomeTimePipePipe implements PipeTransform {
  // adding a default value in case you don't want to pass the format then 'yyyy-MM-dd' will be used
   // adding a default value in case you don't want to pass the format then 'yyyy-MM-dd' will be used
   transform(date: any): string {

    let hour=date.split(':')[0]+':'+date.split(':')[1]
   
    return hour
  }
}

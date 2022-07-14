import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'customtimeAmPmPipe'
})
export class CustomeTimeAmPmPipe implements PipeTransform {
	transform(time: any): string {

		var hours = time[0] + time[1];
		var min = time[3] + time[4];
		if (hours < 12) {
			// console.log(hours);
			// hours = (hours< 10) ? '0' + hours : hours;
			// console.log(hours);
			return hours + ':' + min + ' AM';
		} else {
			if (hours == 12) {
				// hours = hours;
				// console.log(hours);
				// hours = (hours.length < 10) ? hours : hours;
				return hours + ':' + min + ' PM';
			}
			else {
				// console.log(hours);
				// hours = hours - 12;
				// hours = (hours < 10) ? '0' + hours : hours;
				// console.log(hours);
				return (hours - 12) + ':' + min + ' PM';
			}
		}
	}
}
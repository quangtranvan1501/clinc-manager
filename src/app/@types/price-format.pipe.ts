import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
})
export class PriceFormatPipe implements PipeTransform {
    transform(value: number): string {
        if (isNaN(value) || value === null) {
            return '';
        }

        // const formattedPrice = value
        //   .toString()
        //   .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // return formattedPrice;
        return value.toLocaleString('en-US');
    }
}

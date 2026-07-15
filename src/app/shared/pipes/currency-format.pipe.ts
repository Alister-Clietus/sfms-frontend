import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
    name: 'sfmsCurrency',
    standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {

    constructor(private currencyPipe: CurrencyPipe) { }

    transform(value: number | string | null | undefined, currencyCode: string = 'USD'): string | null {
        if (value === null || value === undefined || value === '') {
            return '-';
        }

        // CODE-FE-005: Standardized precision (2 decimal places) for financial data
        return this.currencyPipe.transform(value, currencyCode, 'symbol', '1.2-2');
    }
}
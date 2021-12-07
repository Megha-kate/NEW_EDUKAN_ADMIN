import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {

  // transform(value: string, showMask :boolean): string {
  //   if (!showMask || value.length < 10) {
  //     return value;
  //   }
  //   return 'XXX-XX-' + value.substr(0, value.length - 6);
  // }

  transform(number: string): string {
    const visibleDigits = 4;
    let maskedSection = number.slice(0, -visibleDigits);
    let visibleSection = number.slice(-visibleDigits);
    return maskedSection.replace(/./g, '*') + visibleSection;
  }

}
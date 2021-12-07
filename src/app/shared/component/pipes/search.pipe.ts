import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      if (!it.LINE_2_s) {
        return it.toLowerCase().includes(searchText);
      }
      else {
        return it.LINE_2_s.toLowerCase().includes(searchText);
      }
    });
  }
}
import {PipeTransform, Pipe, Injectable} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({name: 'ucwords'})
    export class UcFirstPipe implements PipeTransform {

     transform(input: string): string {
        

        if(input) { //when input is defined the apply filter
           input = input.toLowerCase().replace(/\b[a-z]/g, function(letter) {
              return letter.toUpperCase();
           });
        }
        return input; 
 
}

}

@Pipe({
  name: 'columnPipe'
})
export class columnPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let columnNames = [];
    for (var i = 0; i < value.length; i++) {
      for (let key in value[i]) {
        if (columnNames.indexOf(key) === -1) {
          columnNames.push(key);
        }
      }
    }
    return columnNames;
  }
} 

@Pipe({
  name: 'rowPipe'
})

export class rowPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let rowValues = Object.keys(value);
    return rowValues.map(k => value[k]);
  }
}

@Pipe({
  name: 'searchPipe'
})
export class searchPipe implements PipeTransform {
  transform(values: any[], filter: string): any {
    if (!values || !values.length) return [];
    if (!filter) return values;
    
    filter = filter.toUpperCase();
    
    if (filter && Array.isArray(values)) {
      const keys = Object.keys(values[0]);
      return values.filter(v => v && keys.some(k => v[k].toUpperCase().indexOf(filter) >= 0));
    }
  }
}

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {

    transform(items: any, filter: any): any {
      
      if (filter && Array.isArray(items)) {
          let filterKeys = Object.keys(filter);
          return items.filter(item =>
              filterKeys.reduce((memo, keyName) =>
                  (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === "", true));
      } else {
          return items;
      }
    }
}

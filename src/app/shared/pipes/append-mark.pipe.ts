import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appendMark' })
export class AppendMarkPipe implements PipeTransform {
  transform(value: string, mark: string, condition: boolean): string {
    return condition ? value + mark : value;
  }
}

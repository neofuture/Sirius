import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'sanitiseUrl',
  standalone: true
})

export class SanitiseUrlPipe implements PipeTransform {
  transform(value: string): string {
    return value?.replace(/[^a-z0-9]/gi, '-').replace("&amp;", "&").toLowerCase();
  }
}

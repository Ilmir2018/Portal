import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {

    transform(value: any, input: string) {

        return value.filter((element) => {
            return element.firm.includes(input)
        })
        
    }

}
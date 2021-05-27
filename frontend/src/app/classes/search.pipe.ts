import { Pipe, PipeTransform } from "@angular/core";
import { Observable, of } from "rxjs";

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {

    transform(value: any, input: string) {

        return value.filter((element) => {
            // if(element.firm == input) {
            //     return element
            // }
            return element.firm.includes(input)
            // return element.firm === input ? element : ''
        })
        
    }

}
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {

    transform(value: any, tab_num: number, name: string, firm: string) {
        return value.filter((element) => {
            return element.tab_num.toString().includes(tab_num)
            || element.name.includes(name) || element.firm.includes(firm)
        })
        
    }

}
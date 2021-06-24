import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {

    transform(value: any, tab_num: number, name: string, firm: string, 
        position: string, division: string,
         city: string, email: string, phone: string,
         ) {
        return value.filter((element) => {
            return element.tab_num.toString().includes(tab_num)
            || element.name.includes(name) || element.firm.includes(firm)
            || element.position.includes(position) || element.division.includes(division)
            || element.city.includes(city) || element.email.includes(email)
            || element.phone.includes(phone)
        })
        
    }

}
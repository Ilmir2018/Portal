import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'search',
    pure: false
})

export class SearchPipe implements PipeTransform {

    transform(value: any, name: string, firm: string,  email: string, phone: string) {
        return value.filter((element) => {
            return element.name.includes(name) || element.firm.includes(firm) 
            || element.email.includes(email) || element.phone.includes(phone)
        })
        
    }

}
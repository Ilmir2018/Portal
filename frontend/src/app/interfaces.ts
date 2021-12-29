export interface User {
    email: string
    password: string
    date?: Date
}

export interface ContactResponse {
    contacts: Contact[],
    menu: Menu
}

export interface UserRole {
    email: string,
    user_id: string
    // title_id?: number,
    permissions: [false, false, false]
}

export interface Contact {
    name: string
    firm: string
    email: string
    password:string
    phone?: string
    user?: string,
    id?: string,
    date?: Date,
    roles?: [],
    imageSrc?: File
    user_id?: string
}

export interface Menu {
    title: string
    url: string
    subtitle?: []
}

export interface Filter {
    name?: string
    firm?: string
    email?: string
    phone?: string
}

export interface GridColumnDefinition {
    field: string;
    width: any;
    actualWidth?: number;
    name?: string;
    index?: number;
    show: boolean;
    order: number;
}

export interface NavItem {
    title: string;
    url: string;
    subtitle?: NavItem[];
}

export interface NavItemNew {
    id?: number;
    title: string;
    url: string;
    subtitle?: NavItemNew[];
    parent_id: number;
}

export interface ContactField {
    id: number
    field: string
    filter: boolean
}
export interface User {
    email: string
    password: string
    date?: Date
}

export interface ContactResponse {
    contacts: Contact[],
    menu: Menu
}

export interface Contact {
    name: string
    firm: string
    email: string
    phone?: string
    user?: string,
    _id?: string,
    date?: Date,
    roles?: []
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

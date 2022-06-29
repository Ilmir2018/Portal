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
    name?: string
    email: string,
    user_id: string
    // title_id?: number,
    permissions: [boolean, boolean, boolean]
}

export interface Contact {
    name: string
    firm: string
    email: string
    password: string
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
    id?: string;
    title: string;
    url: string;
    subtitle?: NavItemNew[];
    parent_id: string;
    level: string
}

export interface ContactField {
    id: number
    field: string
    filter: boolean
}

export interface NewTable {
    title: string
}

export interface Field {
    column_name: string
    data_type: string
}

export interface NewField {
    title: string
    column_name: string
    data_type: string
}


export interface DataFields {
    fields: any
    data: any
}

export interface Builder {
    page_id: number
}

export interface Page {
    id: number
    title: string
    containers?: Container[]
}

export interface Container {
    id: number
    page_id: number
    type: string
    elements: Element[]
}

export interface Element {
    id: number
    container_id: number
    widgets: Widget[]
}

export interface Widget {
    id: number
    element_id: number
    type: string
}




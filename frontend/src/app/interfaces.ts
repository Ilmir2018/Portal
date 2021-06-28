export interface User {
    email: string
    password: string
}

export interface Contact {
    name: string
    firm: string
    email: string
    phone?: string
    user?: string,
    _id?: string
}

export interface Menu {
    title: string
    subtitle?: Submenu []
}

export interface Submenu {
    title: string
    subtitle?: Menu[]
}

export interface Filter {
    name?: string
    firm?: string
    email?: string
    phone?: string
}

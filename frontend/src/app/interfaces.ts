export interface User {
    email: string
    password: string
}

export interface Contact {
    name: string
    tab_num: number
    position?: string
    division?: string
    city?: string
    firm: string
    email: string
    phone?: string
    status: boolean,
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
    tab_num?: number
    name?: string
    position?: string
    division?: string
    city?: string
    firm?: string
    email?: string
    phone?: string
}

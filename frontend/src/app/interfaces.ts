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

export interface Filter {
    firm?: string
}
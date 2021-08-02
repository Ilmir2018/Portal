export interface User {
    email: string
    password: string
    date?: Date
}

export interface Contact {
    name: string
    firm: string
    email: string
    phone?: string
    user?: string,
    _id?: string,
    date?: Date
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

export interface GridColumnDefinition {
    field: string;
    width: number;
    actualWidth?: number;
    name?: string;
    index?: number;
    show: boolean;
    order: number;
  }

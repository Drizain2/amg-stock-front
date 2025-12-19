export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    COMPANY_ADMIN = 'COMPANY_ADMIN',
    BRANCH_MANAGER = 'BRANCH_MANAGER',
    EMPLOYEE = 'EMPLOYEE',
}

// Types de mouvements de stock
export enum StockMovementType {
    PURCHASE = 'PURCHASE',
    SALE = 'SALE',
    TRANSFER_OUT = 'TRANSFER_OUT',
    TRANSFER_IN = 'TRANSFER_IN',
    ADJUSTMENT = 'ADJUSTMENT',
    RETURN = 'RETURN',
    DAMAGE = 'DAMAGE',
    INITIAL = 'INITIAL',
}

// Unités de mesure
export enum ProductUnit {
    PIECE = 'PIECE',
    KG = 'KG',
    LITER = 'LITRE',
    METER = 'METRE',
    BOX = 'BOX',
    PACK = 'PACK',
}

//Status genéraux
export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

//Types de tri
export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

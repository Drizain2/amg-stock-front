/**
 * Valide une adresse email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Valide un numéro de téléphone
 */
export const isValidPhone = (phone: string): boolean => {
    // Format accepté: +225 XX XX XX XX XX ou 0X XX XX XX XX
    const phoneRegex = /^(\+225|0)[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Valide la force d'un mot de passe
 */
export const validatePasswordStrength = (password: string): {
    isValid: boolean
    strength: 'weak' | 'medium' | 'strong'
    errors: string[]
} => {
    const errors: string[] = []
    let strength: 'weak' | 'medium' | 'strong' = 'weak'

    if (password.length < 6) {
        errors.push('Le mot de passe doit contenir au moins 6 caractères')
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
        Boolean
    ).length

    if (strengthScore <= 2) {
        strength = 'weak'
        errors.push('Mot de passe faible. Ajoutez des majuscules, chiffres ou caractères spéciaux')
    } else if (strengthScore === 3) {
        strength = 'medium'
    } else {
        strength = 'strong'
    }

    return {
        isValid: errors.length === 0,
        strength,
        errors,
    }
}

/**
 * Valide un SKU
 */
export const isValidSKU = (sku: string): boolean => {
    // Format: PRD-XXXX ou similaire
    const skuRegex = /^[A-Z]{3}-\d{4,}$/
    return skuRegex.test(sku)
}

/**
 * Valide un montant
 */
export const isValidAmount = (amount: number | string): boolean => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return !isNaN(numAmount) && numAmount >= 0
}

/**
 * Valide une quantité
 */
export const isValidQuantity = (quantity: number | string): boolean => {
    const numQuantity = typeof quantity === 'string' ? parseInt(quantity) : quantity
    return !isNaN(numQuantity) && numQuantity > 0 && Number.isInteger(numQuantity)
}

/**
 * Valide un code de branche
 */
export const isValidBranchCode = (code: string): boolean => {
    // Format: BR-XXX ou similaire
    const codeRegex = /^[A-Z]{2,4}-[A-Z0-9]{3,}$/
    return codeRegex.test(code)
}

/**
 * Vérifie si une valeur est vide
 */
export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true
    if (typeof value === 'string') return value.trim().length === 0
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
}

/**
 * Nettoie un numéro de téléphone
 */
export const cleanPhone = (phone: string): string => {
    return phone.replace(/\D/g, '')
}

/**
 * Nettoie une chaîne de caractères
 */
export const sanitizeString = (str: string): string => {
    return str.trim().replace(/\s+/g, ' ')
}

/**
 * Valide un pourcentage
 */
export const isValidPercentage = (value: number | string): boolean => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return !isNaN(numValue) && numValue >= 0 && numValue <= 100
}
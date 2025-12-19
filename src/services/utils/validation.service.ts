/**
 * SErvice de validation
 */
class ValidationService {
    /**
     * Valide une addresse email
     */
    isEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(String(email).toLowerCase())
    }

    /**
     * Valide un numéro de téléphone
     */
    isPhone(phone: string): boolean {
        const re = /^(?:\+225|0)[0-9]{10}$/
        return re.test(phone.replace(/\s+/g, ''))
    }

    /**
     * Valide un mot de pass
     */
    isValidPassword(password: string, minLength = 6): boolean {
        return password.length >= minLength
    }

    /**
     * Valide la force du mot de passe
     */
    getPasswordStrength(password: string): {
        score: number,
        label: "Faible" | "Moyen" | "Fort" | "Très Fort",
        color: string
    } {
        let score = 0
        if (password.length >= 8) score += 1
        if (/[A-Z]/.test(password)) score += 1
        if (/[0-9]/.test(password)) score += 1
        if (/[^A-Za-z0-9]/.test(password)) score += 1

        const labels = ["Faible", "Moyen", "Fort", "Très Fort"] as const
        const colors = ["red", "orange", "yellow", "green"]

        const index = Math.min(Math.floor(score / 2), 3)

        return {
            score,
            label: labels[index],
            color: colors[index]
        }
    }

    /**
     * Valide un SKU
     */
    isSKU(sku: string): boolean {
        const skuRegex = /^[A-Z]{3}-\d{4,}$/
        return skuRegex.test(sku)
    }

    /**
     * Valide un montant
     */
    isAmount(amount: string | number): boolean {
        const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
        return !isNaN(numAmount) && numAmount >= 0
    }

    /**
     * Valide une quantité
     */
    isQuantity(quantity: string | number): boolean {
        const numQuantity = typeof quantity === "string" ? parseInt(quantity) : quantity
        return !isNaN(numQuantity) && numQuantity > 0 && Number.isInteger(numQuantity)
    }

    /**
     * Valide un pourcentage
     */
    isPercent(percent: string | number): boolean {
        const numPercent = typeof percent === "string" ? parseFloat(percent) : percent
        return !isNaN(numPercent) && numPercent >= 0 && numPercent <= 100
    }

    /**
     * Verifie si une valeur est vide
     */
    isEmpty(value: any): boolean {
        if (value === null || value === undefined) return true
        if (typeof value === "string" && value.trim() === "") return true
        if (Array.isArray(value) && value.length === 0) return true
        if (typeof value === "object" && Object.keys(value).length === 0) return true
        return false
    }

    /**
     * Valide un code de branche
     */
    isBranchCode(code: string): boolean {
        const re = /^[A-Z]{2,4}-[A-Z0-9]{3,}$/
        return re.test(code)
    }

    /**
     * Valide une URL
     */
    isURL(url: string): boolean {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }
}

export default new ValidationService()
/**
 * Service de formatage
 */
class FormatService {
    /**
     * Formate un nombre en device(XOF)
     */
    currency(amount: number | string, currency = 'XOF'): string {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
        if (isNaN(numAmount)) return '0 ' + currency

        return new Intl.NumberFormat('fr-FR', {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numAmount)
    }

    /**
     * Formate un nombre
     */
    number(value: string | number, decimals = 0): string {
        const numValue = typeof value === "string" ? parseFloat(value) : value

        if (isNaN(numValue)) return '0'

        return new Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(numValue)
    }

    /**
     * Format un pourcentage
     */
    percent(value: number | string, decimals = 2): string {
        const numValue = typeof value === "string" ? parseFloat(value) : value

        if (isNaN(numValue)) return '0%'

        return new Intl.NumberFormat("fr-FR", {
            style: "percent",
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(numValue / 100)
    }

    /**
     * Capitalise la première lettre
     */
    capitalize(text: string): string {
        if (!text) return ""
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    }

    /**
     * Formater un numéro de telephone
     */
    phone(phone: string): string {
        if (!phone) return ""
        const cleaned = phone.replace(/\D/g, "")
        return cleaned.match(/.{1,2}/g)?.join(" ") || phone
    }

    /**
     * Tronqye texte
     */
    truncate(text: string, maxLength: number): string {
        if (!text || text.length <= maxLength) return text
        return text.slice(0, maxLength) + "..."
    }

    /**
     * Génère des initiales
     */
    initials(name: string): string {
        return name
            .split(" ")
            .map(word => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    /**
     * Formate une taille de fichier
     */
    fileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
}

export default new FormatService()
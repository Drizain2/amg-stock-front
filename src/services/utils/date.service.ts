import { differenceInDays, endOfDay, format, isValid, parseISO, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"

/**
 * Service de gesrtion des dates
 */
class DateService {
    private locale = fr
    /**
     * Formate unedate selon le format spécifique
     */
    format(date: string | Date, dateFormat = "dd/MM/yyyy"): string {
        try {
            const parsedDate = typeof date === 'string' ? parseISO(date) : date
            if (!isValid(parsedDate)) return ""
            return format(parsedDate, dateFormat, { locale: this.locale })
        } catch {
            return ""
        }
    }

    /**
     * Formate une date avec l'heure
     */
    formatDateTime(date: string | Date): string {
        return this.format(date, "dd/MM/yyyy 'à' HH:mm")
    }

    /**
     * Formate une date de manière relative
     */
    formatRelative(date: string | Date): string {
        try {
            const parsedDate = typeof date === "string" ? parseISO(date) : date
            const now = new Date()
            const days = differenceInDays(now, parsedDate)
            if (days === 0) return "Aujourd'hui"
            if (days === 1) return "Hier"
            if (days < 7) return `Il y a ${days} jours`
            if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`
            if (days < 365) return `Il y a ${Math.floor(days / 30)} mois`
            return `Il y a ${Math.floor(days / 365)} ans`
        } catch {
            return ""
        }
    }

    /**
     * Obtient le début de la journée
     */
    startOfDay(date: Date = new Date()): Date {
        return startOfDay(date)
    }

    /**
     * Obtient la fin de la journée
     */
    endOfDay(date: Date = new Date()) {
        return endOfDay(date)
    }

    /**
     * Convertir une date en format ISO
     */
    toISOString(date: Date): string {
        return date.toISOString()
    }
    /**
     * Parse une date ISO
     */
    parseISO(date: string): Date {
        return parseISO(date)
    }

    /**
     * Verifier si une date est valide
     */
    isValid(date: any): boolean {
        try {
            return isValid(date instanceof Date ? date : parseISO(date))
        } catch {
            return false
        }
    }

    /**
     * Obtient la date actuelle
     */
    now(): Date {
        return new Date()
    }

    /**
     * Formate pour un input date HTML
     */
    formatForInput(date: string | Date): string {
        return this.format(date, 'yyy-MM-dd')
    }
}

export default new DateService()
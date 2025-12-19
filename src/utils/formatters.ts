import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Formate un nombre en devise (XOF par défaut)
 */
export const formatCurrency = (amount: number | string, currency = 'XOF'): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numAmount)
}

/**
 * Formate un nombre
 */
export const formatNumber = (value: number | string, decimals = 0): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value

    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(numValue)
}

/**
 * Formate un pourcentage
 */
export const formatPercent = (value: number | string, decimals = 2): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value

    return new Intl.NumberFormat('fr-FR', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(numValue / 100)
}

/**
 * Formate une date
 */
export const formatDate = (date: string | Date, dateFormat = 'dd MMMM yyyy'): string => {
    try {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date
        return format(parsedDate, dateFormat, { locale: fr })
    } catch (error) {
        console.error('Error formatting date:', error)
        return ''
    }
}

/**
 * Formate une date et heure
 */
export const formatDateTime = (date: string | Date): string => {
    return formatDate(date, "dd/MM/yyyy 'à' HH'h'mm")
}

/**
 * Formate une date relative (il y a X jours)
 */
export const formatRelativeDate = (date: string | Date): string => {
    try {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000)

        if (diffInSeconds < 60) return 'à l\'instant'
        if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`
        if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`
        if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} j`

        return formatDate(date, 'dd MMM yyyy')
    } catch (error) {
        console.error('Error formatting relative date:', error)
        return ''
    }
}

/**
 * Tronque un texte
 */
export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

/**
 * Capitalise la première lettre
 */
export const capitalize = (text: string): string => {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Formate un nom complet
 */
export const formatFullName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`.trim()
}

/**
 * Formate un numéro de téléphone
 */
export const formatPhone = (phone: string): string => {
    if (!phone) return ''
    // Retire tous les caractères non numériques
    const cleaned = phone.replace(/\D/g, '')
    // Formate en groupes de 2
    return cleaned.match(/.{1,2}/g)?.join(' ') || phone
}

/**
 * Formate une quantité avec son unité
 */
export const formatQuantity = (quantity: number, unit: string): string => {
    return `${formatNumber(quantity)} ${unit}`
}

/**
 * Génère des initiales à partir d'un nom
 */
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
}
/**
 * Utilitaires généraux
 */

/**
 * Génère un ID unique
 */
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Crée un délai (sleep)
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce une fonction
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Throttle une fonction
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

/**
 * Clone profond d'un objet
 */
export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
}

/**
 * Fusionne deux objets profondément
 */
export const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
    const output = { ...target }

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key as keyof T])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key as keyof T] })
                } else {
                    output[key as keyof T] = deepMerge(
                        target[key as keyof T] as any,
                        source[key as keyof T] as any
                    )
                }
            } else {
                Object.assign(output, { [key]: source[key as keyof T] })
            }
        })
    }

    return output
}

/**
 * Vérifie si une valeur est un objet
 */
const isObject = (item: any): boolean => {
    return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Convertit un objet en query string
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
    const params = new URLSearchParams()

    Object.entries(obj).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value))
        }
    })

    return params.toString()
}

/**
 * Parse un query string en objet
 */
export const queryStringToObject = (queryString: string): Record<string, string> => {
    const params = new URLSearchParams(queryString)
    const result: Record<string, string> = {}

    params.forEach((value, key) => {
        result[key] = value
    })

    return result
}

/**
 * Télécharge un fichier
 */
export const downloadFile = (url: string, filename: string): void => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * Copie du texte dans le presse-papier
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        return false
    }
}

/**
 * Formate une taille de fichier
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Génère une couleur aléatoire
 */
export const randomColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

/**
 * Obtient la couleur de contraste (noir ou blanc)
 */
export const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)

    const brightness = (r * 299 + g * 587 + b * 114) / 1000

    return brightness > 128 ? '#000000' : '#FFFFFF'
}

/**
 * Scroll vers un élément
 */
export const scrollToElement = (elementId: string, offset = 0): void => {
    const element = document.getElementById(elementId)

    if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset
        window.scrollTo({ top, behavior: 'smooth' })
    }
}

/**
 * Vérifie si on est sur mobile
 */
export const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )
}

/**
 * Obtient l'extension d'un fichier
 */
export const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}
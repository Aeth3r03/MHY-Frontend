import type { Currency } from "../types/product";

export function formatPrice(price: number, currency: Currency): string {
    const formatter = new Intl.NumberFormat("es-NI", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
    const symbol = currency === "USD" ? "$" : "C$"
    return `${symbol} ${formatter}`
}
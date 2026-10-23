export type Currency = "USD" | "NIO"

export interface Product {
    id: string
    name: string
    description: string
    price: number
    currency: Currency
    categoryId: string
    categoryName?: string
    available: boolean
    imageUrl?: string
    imageId?: string
    createdAt?: Date | undefined
    updatedAt?: Date | undefined
}
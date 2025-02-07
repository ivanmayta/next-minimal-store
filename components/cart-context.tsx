"use client"

import React, { createContext, use, useState, useCallback } from "react"
import { type Product } from "@/lib/products"

interface CartItem extends Product {
    quantity: number // Solo necesitamos el nombre, precio y cantidad
}

interface CartContextType {
    items: CartItem[]
    addToCart: (product: Product) => void // Eliminamos el parámetro `size`
    updateQuantity: (id: string, change: number) => void // Eliminamos el parámetro `size`
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Función para agregar un producto al carrito
    const addToCart = useCallback((product: Product) => {
        setItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id // Solo comparamos por ID, sin tamaño
            )
            if (existingItemIndex > -1) {
                // Si el producto ya está en el carrito, incrementamos la cantidad
                return prevItems.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            } else {
                // Si no está en el carrito, lo agregamos con cantidad 1
                return [...prevItems, { ...product, quantity: 1 }]
            }
        })
    }, [])

    // Función para actualizar la cantidad de un producto en el carrito
    const updateQuantity = useCallback((id: string, change: number) => {
        setItems((prevItems) =>
            prevItems.reduce((acc, item) => {
                if (item.id === id) {
                    // Solo comparamos por ID, sin tamaño
                    const newQuantity = item.quantity + change
                    return newQuantity > 0
                        ? [...acc, { ...item, quantity: newQuantity }] // Actualizamos la cantidad
                        : acc // Si la cantidad es 0 o menor, eliminamos el producto
                }
                return [...acc, item]
            }, [] as CartItem[])
        )
    }, [])

    // Calculamos el total del carrito
    const total = items.reduce((acc, item) => {
        // Usamos el precio del producto (item.price) en lugar de condiciones arbitrarias
        return acc + item.price * item.quantity
    }, 0)
    return (
        <CartContext.Provider
            value={{ items, addToCart, updateQuantity, total }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = use(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}

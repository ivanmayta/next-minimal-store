"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Product } from "@/lib/products" // Asegúrate de que esta interfaz esté definida
import { Header } from "@/components/header"
import { AddToCart } from "@/components/add-to-cart"
import { ProductImage } from "@/components/product-image"
import ProfileHero from "@/components/profile-hero"

export default function Page() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [products, setProducts] = useState<Product[]>([]) // Estado para almacenar los productos de la API
    const [isLoading, setIsLoading] = useState(true) // Estado para manejar la carga
    const [_, startTransition] = useTransition()

    // Función para obtener los productos de la API
    const fetchProducts = async () => {
        try {
            const response = await fetch("https://fakestoreapi.com/products")
            const data = await response.json()
            setProducts(data) // Guardamos los productos en el estado
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setIsLoading(false) // Finalizamos la carga
        }
    }

    // Efecto para cargar los productos al montar el componente
    useEffect(() => {
        fetchProducts()
    }, [])

    const handleProductClick = (product: Product) => {
        startTransition(() => {
            setSelectedProduct(product)
            window.history.pushState(null, "", `/p/${product.id}`)
        })
    }

    const handleBack = useCallback(() => {
        startTransition(() => {
            setSelectedProduct(null)
            window.history.pushState(null, "", "/")
        })
    }, [])

    // Efecto para manejar la tecla "Escape"
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (selectedProduct && event.key === "Escape") {
                handleBack()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [selectedProduct, handleBack])

    // Efecto para manejar cambios en la ruta (popstate)
    useEffect(() => {
        const handlePopState = () => {
            const productId = window.location.pathname.split("/").pop()
            if (productId && productId !== "") {
                const product = products.find((p) => p.id == productId)
                if (product) {
                    setSelectedProduct(product)
                } else {
                    setSelectedProduct(null)
                }
            } else {
                setSelectedProduct(null)
            }
        }

        window.addEventListener("popstate", handlePopState)

        return () => {
            window.removeEventListener("popstate", handlePopState)
        }
    }, [products])

    return (
        <div className="flex flex-col min-h-screen max-w-[1420px] mx-auto w-full">
            <Header isBackVisible={!!selectedProduct} onBack={handleBack} />
            <ProfileHero />
            <nav className="bg-zinc-800 text-white px-2 py-1">
                <a href="">Productos</a>
            </nav>
            <main className="flex-grow relative pt-12">
                {isLoading ? (
                    <p className="text-center">Cargando productos...</p>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-12 pb-8"
                        animate={{ opacity: selectedProduct ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group cursor-pointer"
                                onClick={() => handleProductClick(product)}
                            >
                                <ProductImage
                                    product={product}
                                    layoutId={`product-image-${product.id}`}
                                />
                                <p className="text-sm text-clip line-clamp-2 leading-tight">
                                    {product.title}
                                    {/* Cambiado de `name` a `title` según la API */}
                                </p>
                                <p className="font-semibold">
                                    s/.{product.price}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                )}

                <AnimatePresence>
                    {selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 flex flex-col items-center justify-between bg-white bg-opacity-90"
                            style={{
                                top: "0",
                                height: "calc(100vh - 80px - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
                                paddingTop:
                                    "calc(20px + env(safe-area-inset-top))",
                                paddingBottom: "0",
                            }}
                        >
                            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center p-4">
                                <ProductImage
                                    product={selectedProduct}
                                    maxWidth="100%"
                                    maxHeight="calc(100vh - 250px - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
                                    className="w-full"
                                    layoutId={`product-image-${selectedProduct.id}`}
                                />
                            </div>

                            <motion.div
                                className="w-full max-w-md mx-auto p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <AddToCart product={selectedProduct} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

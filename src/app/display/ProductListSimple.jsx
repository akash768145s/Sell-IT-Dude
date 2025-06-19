"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { Heart, Trash2, Phone, Mail, IndianRupee, Eye, HeartOff } from "lucide-react";

const ProductCard = ({ product, onDelete, onAddToWishlist, onRemoveFromWishlist, isInWishlist }) => {
    const { data: session } = useSession();
    const router = useRouter();

    if (!product) return null;

    const isOwner = session?.user?.email === product.sellerEmail;
    const isAdmin = session?.user?.email === process.env.NEXTAUTH_ADMIN_EMAIL;

    const handleWishlistToggle = () => {
        if (isInWishlist) {
            onRemoveFromWishlist(product);
        } else {
            onAddToWishlist(product);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gray-100 rounded-lg mb-4">
                <Image
                    src={product.imageUrl || "/image-product-1.jpg"}
                    alt={product.name || "Product"}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                    onError={(e) => {
                        e.target.src = "/image-product-1.jpg";
                    }}
                />
            </div>

            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-primary flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {product.price}
                </span>
                <span className="text-sm text-gray-500">{product.category}</span>
            </div>

            <div className="space-y-2">
                <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    View Product
                </button>

                <div className="flex gap-2">
                    {!isOwner && (
                        <button
                            onClick={handleWishlistToggle}
                            className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${isInWishlist
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-primary text-white hover:bg-primary/90"
                                }`}
                        >
                            {isInWishlist ? (
                                <>
                                    <HeartOff className="w-4 h-4" />
                                    Remove
                                </>
                            ) : (
                                <>
                                    <Heart className="w-4 h-4" />
                                    Wishlist
                                </>
                            )}
                        </button>
                    )}

                    {(isOwner || isAdmin) && (
                        <button
                            onClick={() => onDelete(product._id)}
                            className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${isAdmin && !isOwner
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "bg-red-500 text-white hover:bg-red-600"
                                }`}
                            title={isAdmin && !isOwner ? "Admin Delete" : "Delete Product"}
                        >
                            <Trash2 className="w-4 h-4" />
                            {isAdmin && !isOwner ? "Admin Delete" : "Delete"}
                        </button>
                    )}

                    {product.phone && (
                        <a
                            href={`tel:${product.phone}`}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                        >
                            <Phone className="w-4 h-4" />
                        </a>
                    )}

                    {product.sellerEmail && (
                        <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${product.sellerEmail}`}
                            target="_blank"
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                        >
                            <Mail className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductListSimple = ({ products = [] }) => {
    const { data: session } = useSession();
    const [productList, setProductList] = useState(products);
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        setProductList(products);
    }, [products]);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!session?.user?.email) return;

            try {
                const response = await fetch(`/api/wishlist?userEmail=${encodeURIComponent(session.user.email)}`);
                if (response.ok) {
                    const data = await response.json();
                    const wishlistProductIds = data.wishlist?.map(item => item.product?._id || item.productId) || [];
                    setWishlistItems(wishlistProductIds);
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        };

        fetchWishlist();
    }, [session]);

    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setProductList(prev => prev.filter(product => product._id !== id));
                toast.success("Product deleted successfully!");
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Error deleting product");
        }
    };

    const handleAddToWishlist = async (product) => {
        if (!session?.user?.email) {
            toast.error("Please sign in to add items to wishlist");
            return;
        }

        try {
            const response = await fetch("/api/wishlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: product._id,
                    userEmail: session.user.email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setWishlistItems(prev => [...prev, product._id]);
                toast.success("Added to wishlist!");
            } else if (response.status === 409) {
                toast.info("Already in your wishlist");
            } else {
                toast.error("Failed to add to wishlist");
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Error adding to wishlist");
        }
    };

    const handleRemoveFromWishlist = async (product) => {
        if (!session?.user?.email) return;

        try {
            const response = await fetch(`/api/wishlist/${product._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userEmail: session.user.email,
                }),
            });

            if (response.ok) {
                setWishlistItems(prev => prev.filter(id => id !== product._id));
                toast.success("Removed from wishlist!");
            } else {
                toast.error("Failed to remove from wishlist");
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Error removing from wishlist");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Browse Products</h1>

                {productList.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-600">No products found</p>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {productList.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onDelete={handleDeleteProduct}
                                onAddToWishlist={handleAddToWishlist}
                                onRemoveFromWishlist={handleRemoveFromWishlist}
                                isInWishlist={wishlistItems.includes(product._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListSimple; 
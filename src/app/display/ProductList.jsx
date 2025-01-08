// src/app/display/ProductList.jsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import "../../components/Display/CSS/1.css";
import "../../components/Display/CSS/2.css";
import "../../components/Display/CSS/3.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categories = [
  "All",
  "Stationary",
  "Sport Equipment",
  "Electronics",
  "Other Accessories",
];

const ProductCard = ({ product, onDelete, onAddToWishlist }) => {
  const { data: session } = useSession();
  const isSeller = session?.user?.email === product.sellerEmail;
  const router = useRouter();

  const handleNavigateToProductPage = (product) => {
    const productPageUrl = `/product/${product._id}?_id=${encodeURIComponent(
      product._id
    )}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(
      product.price
    )}&sellerEmail=${encodeURIComponent(
      product.sellerEmail
    )}&sellerName=${encodeURIComponent(
      product.sellerName
    )}&description=${encodeURIComponent(
      product.description
    )}&imageUrl=${encodeURIComponent(
      product.imageUrl
    )}&category=${encodeURIComponent(product.category)}
    &sellerName=${product.sellerName}`;

    router.push(productPageUrl);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Do you really want to delete this product?"
    );
    if (confirmDelete) {
      onDelete(product._id);
    }
  };



  return (
    <div className="bg-[#004aad] py-5 mb-[-140px] ">
      <div className="container mt-5 mb-5">
        <div className="d-flex justify-content-center row">
          <div className="col-md-10">
            <div className="row p-2 bg-[#004aad] border rounded">
              <div className="col-md-3 mt-1">
                <Image
                  className="w-[150px] h-[150px] object-cover rounded product-image"
                  src={product.imageUrl}
                  alt={product.name}
                  width={150}
                  height={150}
                />
              </div>
              <div className="col-md-6 mt-1">
                <div className="p-4 bg-[#004aad] rounded-lg max-w-sm">
                  <div className="text-5xl font-semibold text-white">
                    {product.name}
                  </div>
                  <div className="text-[18px] font-medium text-gray-400 mt-1">
                    {product.category}
                  </div>
                  <div className="text-[18px] text-gray-300 mt-2">
                    Seller:{" "}
                    <span className="font-medium text-gray-300 ">
                      {product.sellerName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="align-items-center align-content-center col-md-3 border-left mt-1">
                <div className="d-flex flex-row align-items-center">
                  <h4 className="mr-1 text-white">&#x20b9; {product.price}</h4>
                </div>
                <div className="d-flex flex-column h-full mt-4">
                  {(session?.user?.name === product.sellerName ||
                    session?.user?.email ===
                      "sakthimuruganakash@gmail.com") && (
                    <button
                      className="btn btn-danger btn-sm mb-2"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  )}
                  {!isSeller && (
                    <button
                      className="btn btn-primary btn-sm mb-2"
                      onClick={() => onAddToWishlist(product)}
                    >
                      Add to Wishlist
                    </button>
                  )}
                  {!isSeller && (
                    <button
                      className="bg-blue-500 btn btn-primary btn-sm"
                      onClick={() => handleNavigateToProductPage(product)}
                    >
                      View Item
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

const ProductList = ({ products = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productList, setProductList] = useState(products);
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsMounted(true);
    setProductList(products);
  }, [products]);

  useEffect(() => {
    const category = searchParams.get("category") || "All";
    setSelectedCategory(category);
  }, [searchParams]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);

    router.push(`/display?category=${encodeURIComponent(newCategory)}`);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setProductList((prevList) =>
          prevList.filter((product) => product._id !== id)
        );
        setMessage("Product deleted successfully.");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete product:", errorData.message);
        setMessage("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Error deleting product.");
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(responseData.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Error adding to wishlist.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const filteredProducts = productList.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="mb-3 bg-[#004aad] text-white p-3 rounded">
        <div className="container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="form-control mb-2"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-control"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      {filteredProducts.length > 0 ? (
        <div className="container">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDeleteProduct}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      ) : (
        <p className="text-center mt-5 text-white">No products found.</p>
      )}
    </>
  );
};

export default ProductList;

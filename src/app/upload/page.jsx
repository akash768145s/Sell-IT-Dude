'use client';
import React, { useState, useEffect } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Lottie from "lottie-react";
import animationData from "../../../public/Animation - 1723045195064.json";
import animationData1 from "../../../public/Animation - 1723045183398.json";

import Image from "next/image";
import backIcon from "../../../public/ba.png";

import Alert from "@/components/Alert/Alert"; 

const categories = [
  "Stationary",
  "Sport Equipment",
  "Electronics",
  "Other Accessories",
];

const UploadButton = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alert, setAlert] = useState(null); // Alert state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
    }
  }, [session, status, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const preventScrolling = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScrolling = () => {
      document.body.style.overflow = "auto";
    };

    preventScrolling();

    return () => {
      enableScrolling();
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!session) {
      router.push("/sign-in");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          sellerName: session?.user?.name || "Unknown Seller",
          sellerEmail: session?.user?.email || "placeholder@example.com",
        }),
      });

      if (response.ok) {
        setAlert({
          message: "Product created successfully",
          variant: "success",
        });
        setFormData({ name: "", description: "", price: "", category: "" });
        setImageUrl("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error creating product");
        setAlert({
          message: errorData.message || "Error creating product",
          variant: "error",
        });
        if (imageUrl) {
          setImageUrl("");
        }
      }
    } catch (err) {
      setError("Error creating product");
      setAlert({
        message: "Error creating product",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .contactButton {
          position: fixed;
          top: 1.1rem;
          left: 1rem;
          display: flex;
          align-items: center;
          background-color: #004aad;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border-bottom: 2px solid #004aad;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .contactButton:hover {
          filter: brightness(110%);
          transform: translateY(-1px);
          border-bottom: 4px solid #004aad;
        }

        .contactButton:active {
          filter: brightness(90%);
          transform: translateY(1px);
          border-bottom: 1px solid #004aad;
        }

        .form-container {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          padding: 20px;
          max-width: 400px;
          width: 100%;
        }

        .lottie-container {
          width: 300px;
          height: 300px;
        }

        @media (max-width: 767px) {
          .contactButton {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            display: flex;
          }

          .form-container {
            max-width: 150%;
            width: 150%;
            padding: 20px;
            margin: 0 auto;
            margin-top: 20px;
            margin-left: -55px;
          }

          .lottie-container {
            width: 100%;
            height: auto;
            margin-top: 0;
          }
        }
      `}</style>

      <main
        className="flex min-h-screen flex-col items-center justify-between p-24 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(to bottom,#ffffff,#004AAD )",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button className="contactButton" onClick={() => router.push("/")}>
          <Image
            src={backIcon}
            alt="Back"
            width={10}
            height={10}
            className="mr-2"
          />
          Back
        </button>
        {isMobile ? (
          <div className="flex flex-col items-center w-full">
            <form
              onSubmit={handleSubmit}
              className="form-container flex flex-col space-y-4 rounded-md shadow-md"
            >
              {error && <p className="text-red-500">{error}</p>}
              <UploadDropzone
                appearance={{
                  container: {
                    border: "1px solid blue",
                  },
                  uploadIcon: {
                    color: "blue",
                  },
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImageUrl(res[0].url);
                }}
                onUploadError={(error) => {
                  setAlert({
                    message: `ERROR! ${error.message}`,
                    variant: "error",
                  });
                }}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="border p-2"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product Description"
                required
                className="border p-2"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Product Price"
                required
                className="border p-2"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="border p-2"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                style={{
                  background: "#004AAD",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex justify-between w-full items-center">
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              style={{ width: 300, height: 300 }}
            />
            <form
              onSubmit={handleSubmit}
              className="form-container flex flex-col space-y-4 p-6 rounded-md shadow-md mx-4"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                marginTop: "-80px",
              }}
            >
              {error && <p className="text-red-500">{error}</p>}
              <UploadDropzone
                appearance={{
                  container: {
                    border: "1px solid blue",
                  },
                  uploadIcon: {
                    color: "blue",
                  },
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImageUrl(res[0].url);
                }}
                onUploadError={(error) => {
                  setAlert({
                    message: `ERROR! ${error.message}`,
                    variant: "error",
                  });
                }}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="border p-2"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product Description"
                required
                className="border p-2"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Product Price"
                required
                className="border p-2"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="border p-2"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                style={{
                  background: "#004AAD",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
            <Lottie
              animationData={animationData1}
              loop={true}
              autoplay={true}
              style={{
                width: 320,
                height: 320,
                marginTop: -250,
                marginRight: 20,
              }}
            />
          </div>
        )}
      </main>

      {alert && (
        <Alert
          message={alert.message}
          variant={alert.variant}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
};

export default UploadButton;

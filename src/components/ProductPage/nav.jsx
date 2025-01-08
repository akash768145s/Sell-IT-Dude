"use client";
import React from "react";
import Image from "next/image";
import phoneIcon from "../../../public/wishli.png";
import backIcon from "../../../public/ba.png";


const Navbar = () => {
  const handleGoHome = () => {
    window.location.href = "/display";
  };

  const handleGoWishlist = () => {
    window.location.href = "/wishlist";
  };

  return (
    <>
      <style jsx>{`
        .navbar {
          background-color: #004aad;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }

        .logoContainer {
          display: flex;
          align-items: center;
        }

        .logo {
          margin-right: 1rem;
        }

        .title {
          color: white;
          font-size: 2.5rem;
          font-family: "Oswald", sans-serif;
          font-weight: 300;
        }

        .navButtons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .contactButton {
          display: flex;
          align-items: center;
          background-color: #004aad;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border-bottom: 2px solid #004aad;
          cursor: pointer;
          transition: all 0.3s ease;
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

        @media (max-width: 767px) {
          .title {
            display: none;
          }

          .contactButton {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
      <nav className="navbar">
        <button className="contactButton" onClick={handleGoHome}>
          <Image
            src={backIcon}
            alt="Back"
            width={10}
            height={10}
            className="mr-2"
          />
          Back
        </button>
        <div className="navButtons">
          <button className="contactButton" onClick={handleGoWishlist}>
            <Image
              src={phoneIcon}
              alt="Wishlist"
              width={30}
              height={30}
              className="mr-2"
            />
            Wishlist
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

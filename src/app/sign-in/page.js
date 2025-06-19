"use client";
import React, { useEffect } from "react";
import GoogleButton from "@/components/googlebutton";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/");
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: 'url("/sign-in.png")' }}
    >
      {session ? (
        <>
          <div className="text-center">
            <Image
              src="/Logo2.png"
              alt="Logo"
              width={175}
              height={175}
              className="mb-4"
              style={{ marginLeft: "20px" }}
            />
            <h1
              className="font-semibold text-white mb-2"
              style={{ fontSize: "2rem", marginTop: "-35px" }}
            >
              Sell it Dude!
            </h1>
            <button
              onClick={handleGoToDashboard}
              className="px-4 -mr-3 py-2 bg-[#004aad] text-white rounded hover:bg-[#004aad] transition-colors duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <Image
            src="/Logo2.png"
            alt="Logo"
            width={175}
            height={175}
            className="mb-4"
            style={{ marginLeft: "20px" }}
          />
          <h1
            className="font-semibold text-white mb-2"
            style={{ fontSize: "2rem", marginTop: "-35px" }}
          >
            Sell it Dude!
          </h1>
          <GoogleButton />
        </div>
      )}
    </div>
  );
};

export default HomePage;

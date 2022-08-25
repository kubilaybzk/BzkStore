import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Notfound() {
  return (
    <div className="flex flex-row mx-5 items-center justify-center h-screen">
      <div className="max-w-md text-center flex flex-col justify-center items-center">
        <div className="text-5xl font-dark font-bold">404</div>
        <p className="text-2xl md:text-3xl font-light leading-normal">
          Sayfa bulunamadı.{" "}
        </p>
        <p className="mb-8">BU sorun en kısa zamanda düzelecektir.</p>

        <Link href={"/"}>
        <button className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700">
         Ana Sayfaya dön
        </button>
        </Link>
      </div>
      <div className="">
        <Image
          src={"/404.jpg"}
          width={"200px"}
          height={"200px"}
          layout="responsive"
          alt="Not found"
        />
      </div>
    </div>
  );
}

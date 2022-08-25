/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";

export default function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title="Unauthorized Page">
      <div className="flex flex-col justify-center items-center">
        <div className="flex-1 block">
          <img src={"/error_401.webp"} layout="responsive" alt="polis" />
        </div>
        <h1 className="text-xl">Yetkisiz Giriş</h1>
        {message && <div className="mb-4 text-red-500">{message}</div>}
        <Link href={"/login"}>
          <button className="bg-blue-400 w-1/5 h-12 rounded  text-white text-lg">
            Giriş Yap
          </button>
        </Link>
      </div>
    </Layout>
  );
}

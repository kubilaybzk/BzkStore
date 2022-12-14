import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { useRouter } from "next/router";
import { notification } from "antd";

export default function LoginScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { data: session } = useSession(); //Session bilgilerini alıyoruz

  const router = useRouter(); // router bilgilerini alıyoruz

  const { redirect } = router.query;
  /*
  Redirect veya yönlendirme, web sunucuları içerisinde verilen
   bir komut vasıtasıyla bir adresin farklı bir adrese geçici 
   veya kalıcı olarak yönlendirilmesidir. 
  */

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
      //Tanımlı redirect edilen sayfaya değilse ana sayfaya dön diyoruz
    }
  }, [router, session, redirect]);

  const submitHandler = async ({ email, password }) => {
    //Kullanıcının giriş yapması içing gerekli olan fonksiyon burada
    //kullanıcı eğer şifre yada e-posta'yı hatalı girerse  
    //cath içine düşecek ve notification çıkarak hatayı kullanıcıya gösterecek
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        notification.open({
          placement:"top",
          message: "Hatalı Giriş ! ",
          description: "E-posta yada şifreniz hatalı lütfen kontrol edin.",
        });
      }
    } catch (err) {
      console.log(getError(err));
    }
  };
  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4 ">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4 ">
          Don&apos;t have an account? &nbsp;
          <Link href="register">Register</Link>
        </div>
      </form>
    </Layout>
  );
}

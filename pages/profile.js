import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { notification } from "antd";
import { getError } from "../utils/error";
import axios from "axios";
export default function profile() {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("name", session.user.name);
    setValue("email", session.user.email);
  }, [session.user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      notification.open({
        message: "Profile updated successfully",
      });
      if (result.error) {
        notification.open({
          message: result.error,
        });
      }
    } catch (err) {
      notification.open({
        message: getError(err),
      });
    }
  };

  return (
    <Layout title="Profilim">
      <div className="flex flex-col">
        <h1 className="text-2xl text-gray-400 : ">Kullanıcı bilgilerim</h1>
        <div className="flex flex-col">
            <h1>Eski bilgilerim:</h1>
          <span className=" text-2xl">
            <b>Name::</b> {session.user.name}
          </span>
          <span className=" text-2xl">
            <b>Email:</b> {session.user.email}
          </span>
        </div>
      </div>
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Hesabım</h1>

        <div className="mb-4">
          <label htmlFor="name">İsim</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter name",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Şifre</label>
          <input
            className="w-full"
            type="password"
            id="password"
            {...register("password", {
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
          />
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Şifre tekrar</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "confirm password is more than 5 chars",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 ">Şifreler eşleşmedi</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Profili güncelle</button>
        </div>
      </form>
    </Layout>
  );
}

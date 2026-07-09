/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { FC, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";

import { toast } from "react-hot-toast";
import { useRegisterUserMutation } from "@/redux/auth/authApi";


type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid Email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState<boolean>(false);
const [register, { data, error, isSuccess, isLoading }] = useRegisterUserMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration Successfully";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
  try {
    await register(values).unwrap();
  } catch (err: any) {
    toast.error(err?.data?.message || "Registration failed");
  }
},
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 text-center">
        Create your account
      </h1>
      <p className="text-sm text-gray-500 text-center mt-1 mb-6">
        Join NextID and get started
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="text-sm font-medium text-gray-700 mb-1.5 block"
            htmlFor="name"
          >
            Name
          </label>
          <div className="relative">
            <HiOutlineUser
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              id="name"
              placeholder="Giselle Georges"
              className={`w-full h-11 pl-10 pr-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 ${
                errors.name && touched.name
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />
          </div>
          {errors.name && touched.name && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label
            className="text-sm font-medium text-gray-700 mb-1.5 block"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <HiOutlineMail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              id="email"
              placeholder="you@example.com"
              className={`w-full h-11 pl-10 pr-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 ${
                errors.email && touched.email
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />
          </div>
          {errors.email && touched.email && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.email}
            </span>
          )}
        </div>

        <div>
          <label
            className="text-sm font-medium text-gray-700 mb-1.5 block"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type={!show ? "password" : "text"}
              name="password"
              value={values.password}
              onChange={handleChange}
              id="password"
              placeholder="••••••••"
              className={`w-full h-11 pl-10 pr-10 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 ${
                errors.password && touched.password
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />
            {!show ? (
              <AiOutlineEyeInvisible
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition"
                size={18}
                onClick={() => setShow(true)}
              />
            ) : (
              <AiOutlineEye
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition"
                size={18}
                onClick={() => setShow(false)}
              />
            )}
          </div>
          {errors.password && touched.password && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-fuchsia-500/30"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          className="flex items-center justify-center size-11 rounded-xl border border-gray-200 hover:bg-gray-50 transition active:scale-95"
          aria-label="Continue with Google"
        >
          <FcGoogle size={20} />
        </button>
        <button
          type="button"
          className="flex items-center justify-center size-11 rounded-xl border border-gray-200 hover:bg-gray-50 transition active:scale-95"
          aria-label="Continue with GitHub"
        >
          <AiFillGithub size={20} className="text-gray-800" />
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <span
          className="text-fuchsia-600 font-semibold cursor-pointer hover:text-fuchsia-700 transition"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </p>
    </div>
  );
};

export default Signup;
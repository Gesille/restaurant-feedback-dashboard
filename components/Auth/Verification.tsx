/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useActivateUserMutation } from "@/redux/auth/authApi";
import React, { FC, useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
 const [activation, { isSuccess, error, isLoading }] = useActivateUserMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);



  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

 const verificationHandler = async () => {
  const verificationNumber = Object.values(verifyNumber).join("");

  if (verificationNumber.length !== 4) {
    setInvalidError(true);
    return;
  }

  try {
   await activation({
  activationToken: token,
  activationCode: verificationNumber,
}).unwrap();
    toast.success("Account activated successfully");
    setRoute("Login");
  } catch (err: any) {
    toast.error(err?.data?.message || "Invalid code");
    setInvalidError(true);
  }
};

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 text-center">
        Verify your account
      </h1>
      <p className="text-sm text-gray-500 text-center mt-1">
        Enter the 4-digit code we sent to your email
      </p>

      <div className="w-full flex items-center justify-center mt-6">
        <div className="size-16 rounded-full bg-linear-to-r from-pink-500 via-fuchsia-600 to-purple-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
          <VscWorkspaceTrusted size={30} className="text-white" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-8">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-14 h-14 rounded-xl border-2 text-center text-xl font-semibold text-gray-900 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              invalidError
                ? "shake border-red-400 focus:border-red-400"
                : "border-gray-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/40"
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>

     <button
  disabled={isLoading}
  className="w-full h-11 mt-8 rounded-xl text-white text-sm font-semibold bg-linear-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-fuchsia-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
  onClick={verificationHandler}
>
  {isLoading ? "Verifying..." : "Verify OTP"}
</button>

      <p className="text-center text-sm text-gray-500 mt-6">
        Go back to{" "}
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

export default Verification;
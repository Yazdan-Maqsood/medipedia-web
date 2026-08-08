import React from "react";
import { apiUrl } from '../config/constant';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation'; // <-- Added redirect
import Data from "./Data";

export const metadata = {
  title: "Saved Quiz - Medipedia",
};

export default async function page() {
  const datas = await getServerSession(authOptions);
  
  // ✅ Agar user login NAHI hai, toh seedha login page par bhej dein
  if (!datas) {
      redirect('/login');
  }
  
  return (
    <section className="shopping-cart-area ptb-50">
      <h1 className="text-center">Saved Quiz</h1>
      <br />
      <Data user_id={datas.user.id}></Data>
    </section>
  );
}
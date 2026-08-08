import React from 'react';
import Link from 'next/link';
import { apiUrl } from '../config/constant';
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation'; // <-- Added this
import Data from './Data';

export const metadata = {
    title: "History - Medipedia",
};

export default async function page() {
    const datas = await getServerSession(authOptions);

    // ✅ Agar user login NAHI hai, toh seedha login page par bhej dein
    if (!datas?.user?.id) {
        redirect('/login');
    }

    // ✅ Agar login hai, toh history page render karein
    return (
        <section className="shopping-cart-area ptb-50">
            <h1 className="text-center">History</h1>
            <br />
            <Data user_id={datas.user.id} />
        </section>
    );
}
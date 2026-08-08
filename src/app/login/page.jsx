import Link from 'next/link';
import React, { Suspense } from 'react';
import Form from '../login/Form';
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';

export const metadata = {
    title: "Login to Medipedia",
};

export default async function page() {
    const data = await getServerSession(authOptions);

    // 1. Agar user login hai toh seedha Home page par bhej dein
    if (data) {
        redirect('/');
    }

    // 2. Agar login nahi hai, toh seedha Form dikhayen (extra 'else' ki zaroorat nahi)
    return (
        <section className="sign-up-section ptb-50">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-3 ps-0" />
                    <div className="col-lg-6 col-md-6 ps-0">
                        <div className="sign-up-form">
                            <h2>Welcome Back</h2>
                            <p>Fill your email and password to login.</p>
                            {/* Form uses useSearchParams(), which needs a Suspense boundary. */}
                            <Suspense fallback={null}>
                                <Form />
                            </Suspense>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 ps-0" />
                </div>
            </div>
        </section>
    );
}
'use client'
import React, { useEffect, useState } from 'react'
import Username from './Username'
import { apiUrl, profiledata } from '../config/constant';
import { useSession } from "next-auth/react";

export default function Header() {
    const { data: session, status } = useSession();
    const [name, setname] = useState("");
    const [load, setload] = useState(false);

    useEffect(() => {
        if (session && session.user) {
            setload(true)
            // Fetch profile data when the component mounts
            const fetchData = async () => {
                try {
                    const data = await profiledata(session.user.id);
                    setload(false)
                    setname(data.user_name); // Set the email obtained from profile data into state
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                }
            };
            fetchData();
        }
    }, [session]);

    return (
        <section
            className="banner-section overflow-hidden bg-img"
            data-background="/assets/images/banner/banner-bg.jpg"
        >
            <div className="container mw-1470">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="banner-content ptb-100" >
                            <span className="top-title">
                                <span>Online!</span>Global learning platform
                            </span>
                            {session ? (
                                <>
                                    {load ? (
                                        <h1>
                                            <span></span>
                                            <span style={{ fontSize: 20 }}>Loading..</span>
                                        </h1>
                                    ) : (
                                        <h1>
                                            <span>{name}</span>
                                            <span style={{ fontSize: 20 }}>, Good Evening</span>
                                        </h1>
                                    )}
                                </>
                            ) : (
                                <h1>
                                    <span>Medical Guide</span>
                                </h1>
                            )}

                            <p>
                                Medipedia is an innovative online platform designed exclusively for medical students, providing a comprehensive repository of Multiple Choice Questions (MCQs) to enhance learning and preparation. Tailored to meet the unique needs of medical education, Medipedia offers a vast array of meticulously curated MCQs covering diverse medical specialties, enabling students to test their knowledge, assess their understanding, and reinforce key concepts. With a user-friendly interface and extensive question bank, Medipedia serves as an invaluable resource for aspiring healthcare professionals, facilitating effective exam preparation and fostering continuous learning in the ever-evolving field of medicine.
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="banner-img">
                            <img src="/assets/images/banner/banner-img.png" alt="banner-img" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import Username from "./Username";

export default function Navbar() {
    const { data: session, status } = useSession();
    const { push } = useRouter();

    useEffect(() => {
        const handleBackButton = (event) => {
            if (event.type === 'popstate') {
                if (session) {
                    push('/');
                }
            }
        };

        // Add event listener for popstate event
        window.addEventListener('popstate', handleBackButton);

        // Clean up function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [session, push]);


    const handleLogout = async () => {
        console.log("Logging out...");

        try {
            await signOut({ redirect: false }).then(() => {
                toast.success("Logout successfully!");
                push("/login"); // Redirect to the dashboard page after signing out
            });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };



    // Loading state while session status is being fetched
    if (status === "loading") {

        return (
            <nav className="navbar navbar-section navbar-expand-lg sticky">
                <div className="d-flex justify-content-center " style={{ marginLeft: '10px' }} >
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </nav>
        )

    } else {

        return (
            <nav className="navbar navbar-section navbar-expand-lg sticky">
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/">
                        <img
                            style={{ width: 60 }}
                            src="/assets/images/logo/logo.png"
                            alt="Logo"
                        />
                    </Link>
                    <div className="nav-right-options left-option ahad">
                        <Link
                            href="/guide"
                            className="d-flex align-items-center text-decoration-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={13}
                                height={13}
                                viewBox="0 0 13 13"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.75 9.75H13V13H9.75V9.75ZM4.875 9.75H8.125V13H4.875V9.75ZM0 9.75H3.25V13H0V9.75ZM9.75 4.875H13V8.125H9.75V4.875ZM4.875 4.875H8.125V8.125H4.875V4.875ZM0 4.875H3.25V8.125H0V4.875ZM9.75 0H13V3.25H9.75V0ZM4.875 0H8.125V3.25H4.875V0ZM0 0H3.25V3.25H0V0Z"
                                    fill="#79817F"
                                />
                            </svg>
                            <span className="courses d-none d-xl-block">Medipedia Guide</span>
                        </Link>
                    </div>
                    <div
                        className=""
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarText"
                        aria-controls="navbarText"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="fa fa-bars icons"></i>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link href="/" className="nav-link autoo  active">
                                    Home
                                </Link>
                            </li>
                            {!session && (
                                <>
                                    <li className="nav-item">
                                        <Link href="/about-us" className="nav-link autoo">
                                            About us
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/contact-us" className="nav-link autoo">
                                            Contact us
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/privacy-policy" className="nav-link autoo">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/dmca-policy" className="nav-link autoo">
                                            DMCA Policy
                                        </Link>
                                    </li>
                                </>
                            )}

                            {session && (
                                <>
                                    <li className="nav-item ali">
                                        <Link href="/guide" className="nav-link autoo ">
                                            Medipedia Guide
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/saved-quiz" className="nav-link autoo ">
                                            Saved Quiz
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/history" className="nav-link autoo ">
                                            History
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/book-price" className="nav-link autoo ">
                                            Books Price
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/book-code" className="nav-link autoo ">
                                            Books Code
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/profile" className="nav-link autoo ">
                                            Profile
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    <div className="nav-right-options">
                        <ul>
                            {!session ? (
                                <li>
                                    <Link href="/login" className="main-btn">
                                        <span className="d-none d-xl-block">LOGIN / REGISTER</span>
                                        <div className="d-xl-none" >LOGIN / REGISTER</div>
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    {/* <li>
                                        <div className="main-btn">
                                            <span className="d-none d-xl-block">Welcome, <Username></Username></span>
                                            <div className=" d-xl-none" >Welcome, <Username></Username></div>
                                            
                                        </div>
                                    </li> */}
                                    <li>
                                        <Link href="/guide" className="main-btn">
                                            <span className="d-none d-xl-block">Dashboard</span>
                                            <div className="d-xl-none" >Dashboard</div>
                                        </Link>
                                    </li>
                                    <li>
                                        <div style={{ cursor: 'pointer' }} onClick={handleLogout} className="main-btn">
                                            <span className="d-none d-xl-block">Logout</span>
                                            <div className="d-xl-none" >Logout</div>
                                        </div>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }


}

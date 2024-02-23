'use client'
import React from 'react'
import Username from './Username'
import { useSession } from "next-auth/react";

export default function Header() {
    const { data: session, status } = useSession();
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
                                <h1>
                                    <span><Username></Username></span>
                                    <span style={{ fontSize: 20 }}>, Good Evening</span>
                                </h1>
                            ) : (
                                <h1>
                                    <span>Medical Guide</span>
                                </h1>
                            )}

                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting
                                industry. Lorem Ipsum has been the industry's standard dummy
                                text ever since the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen book.
                            </p>
                            <form className="search-form position-relative z-1">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search for anything"
                                />
                                <button className="main-btn border-0 position-absolute top-50 end-0 translate-middle-y d-flex align-items-center">
                                    <img src="/assets/images/icon/search.svg" alt="search" />
                                    <span className="ms-2 d-none d-sm-block">Search</span>
                                </button>
                            </form>
                            {/* <ul className="ps-0 mb-0 list-unstyled">
                                <li>
                                    <span>Popular :</span>
                                </li>
                                <li>
                                    <a href="courses.html">MARKETING</a>
                                </li>
                                <li>
                                    <a href="courses.html">EDUCATION</a>
                                </li>
                                <li>
                                    <a href="courses.html">TECH</a>
                                </li>
                                <li>
                                    <a href="courses.html">SCIENCE</a>
                                </li>
                            </ul> */}
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

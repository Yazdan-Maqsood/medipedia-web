import React from 'react'
import Link from 'next/link'

export default function () {
    return (
        <>
            {/*=== Start Footer Section ===*/}
            <section className="footer-section section-bg-color-08301f pt-100 pb-75">
                <div className="container mw-1470">
                    <div className="row justify-content-center">
                        <div className="col-lg-3 col-sm-6">
                            <div className="footer-single-item">
                                <a href="index.html" className="d-inline-block footer-logo">
                                    <img
                                        style={{ width: 60 }}
                                        src="/assets/images/logo/logo.png"
                                        alt="Logo"
                                    />
                                </a>
                                <p>
                                    During this era, online learning environun expectedly increased.
                                    The son the
                                </p>
                                <ul className="list-unstyled ps-0 mb-0 d-flex">
                                    <li>
                                        <a href="#">
                                            <img src="/assets/images/play-store.svg" alt="play-store" />
                                        </a>
                                    </li>
                                    <li className="ms-4">
                                        <a href="#">
                                            <img src="/assets/images/app-store.svg" alt="app-store" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="footer-single-item">
                                <h3>About</h3>
                                <ul className="list-unstyled ps-0 mb-0 import-link">
                                    <li>
                                        <a href="about-us.php">Saved Quiz</a>
                                    </li>
                                    <li>
                                        <a href="courses.html">History</a>
                                    </li>
                                    <li>
                                        <a href="events.html">Books Price</a>
                                    </li>
                                    <li>
                                        <a href="courses.html">Books Code</a>
                                    </li>
                                    <li>
                                        <a href="become-instructor.html">Feedback</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="footer-single-item">
                                <h3>Usefull Links</h3>
                                <ul className="list-unstyled ps-0 mb-0 import-link">
                                    <li>
                                        <a href="courses.html">Get Help</a>
                                    </li>
                                    <li>
                                        <a href="contact.html">login</a>
                                    </li>
                                    <li>
                                        <a href="blog.html">Signup</a>
                                    </li>
                                    <li>
                                        <a href="contact.html">Medical Guide</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="footer-single-item">
                                <h3>Sign Up for Our Newsletter</h3>
                                <form className="subscribe-form position-relative z-1">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Your e-mail"
                                    />
                                    <button
                                        type="submit"
                                        className="main-btn border-0 position-absolute top-50 end-0 translate-middle-y"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*=== End Footer Section ===*/}
            <div className="help-icon" title="Help">
                ?
            </div>
        </>

    )
}

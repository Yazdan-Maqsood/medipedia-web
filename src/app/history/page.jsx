import React from 'react'
import Link from 'next/link'
import { apiUrl } from '../config/constant';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";


export default async function page() {
    const datas = await getServerSession(authOptions);
    const data = await getData(datas.user.id)
    return (
        <section className="shopping-cart-area ptb-50">
            <h1 className="text-center">History</h1>
            <br />
            <div className="container">
                <div className="row">
                    {/* <div class="col-lg-1"></div> */}
                    <div className="col-lg-12">
                        {data && data.length > 0 ? (
                            <form className="shopping-cart">
                                <div className="text-center table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col" />
                                                <th scope="col">Test Name</th>
                                                <th scope="col">Total Question</th>
                                                <th scope="col">Marks</th>
                                                <th scope="col">Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="cart-price">
                                                        <i className="fa fa-book color-custom" />
                                                    </td>
                                                    <td className="cart-price">
                                                        <span className="amount">{item.test_name}</span>
                                                    </td>
                                                    <td className="cart-price">
                                                        <span className="amount">{item.total_questions}</span>
                                                    </td>
                                                    <td className="cart-price">
                                                        <span className="amount">{item.marks}</span>
                                                    </td>
                                                    <td className="cart-price">
                                                        <span className="amount">{Math.round(item.marks / item.total_questions * 100)}%</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center">No data available.</div>
                        )}

                    </div>
                    {/* <div class="col-lg-1"></div> */}
                </div>
            </div>
        </section>

    )
}


async function getData(user_id) {
    const formData = new FormData();
    formData.append("user_id", user_id);
    const res = await fetch(`${apiUrl}/history.php`, {
        method: 'POST',
        body: formData,
        cache: 'no-store'
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
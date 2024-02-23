'use client'
import React from "react";
import Link from 'next/link'
import toast from "react-hot-toast";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiUrl } from '../config/constant';


export default function page(props) {
    const MySwal = withReactContent(Swal)
    const router = useRouter();
    const { data: session, status, update } = useSession();

    const promptConfirmation = (redirect, test_id) => {
        {
            MySwal.fire({
                title: "Saved Quiz",
                text: "You saved this Quiz Last time",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Restart",
                cancelButtonText: "Continue",
            }).then((result) => {
                if (result.isConfirmed) {
                    resetdone(redirect,test_id);
                } else {
                    router.push(`/quiz/${redirect}`)
                }
            })

        }

    }


    const resetdone = async (redirect,test_id) => {

        try {
            const formData = new FormData();
            formData.append("test_id", test_id);
            formData.append("user_id", session.user.id);


            const response = await fetch(`${apiUrl}/reset.php`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to send data to PHP');
            }

            const responseData = await response.json();
            if (responseData.success) {
                toast.success("Quiz Reset successfully!")
                router.push(`/quiz/${redirect}?refresh=true`);
            }
        } catch (error) {
            console.error('Error:', error);
        }


    }

    return (

        <div className="container">
            <div className="row">
                {/* <div class="col-lg-1"></div> */}
                <div className="col-lg-12">
                    {props.data && props.data.length > 0 ? (
                        <form className="shopping-cart">
                            <div className="text-center table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col" />
                                            <th scope="col">Test Name</th>
                                            <th scope="col">Marks</th>
                                            <th scope="col">Time</th>
                                            <th scope="col">Options</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.data.map((item, index) => (
                                            <tr key={index}>
                                                <td className="cart-price">
                                                    <i className="fa fa-book color-custom" />
                                                </td>
                                                <td className="cart-price">
                                                    <span className="amount">{item.test_name}</span>
                                                </td>
                                                <td className="cart-price">
                                                    <span className="amount">{item.marks}</span>
                                                </td>
                                                <td className="cart-price">
                                                    <span className="amount">{item.time}</span>
                                                </td>
                                                <td className="cart-price">
                                                    <span className="amount"><i onClick={() => promptConfirmation(`${item.spec_slug}/${item.book_slug}/${item.paper_slug}/${item.test_slug}`,item.test_id)} className="fa fa-eye" ></i></span>
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

    );
}


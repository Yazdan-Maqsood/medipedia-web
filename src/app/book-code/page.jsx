import React from 'react'
import Link from 'next/link'
import { apiUrl } from '../config/constant';
import Data from './Data';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const metadata = {
  title: 'Book Code - Medipedia',
}

export default async function page() {
    const datas = await getServerSession (authOptions);
    const data = await getData(datas.user.id);

    return (
        <section className="event-details-section">
            <div className="container mw-1470">
                <div className="ptb-50">
                    <h1 className="text-center">Books Code</h1>
                    <br />
                    <Data code={data.code} bookcode={data.bookcode} mockcode={data.mockcode} ></Data>
                </div>
            </div>
        </section>
    )
}


async function getData(user_id) {
  const formData = new FormData();
  formData.append("user_id", user_id);
  const res = await fetch(`${apiUrl}/book-code.php`, {
    method: 'POST',
    body: formData,
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}


import React from 'react'
import Link from 'next/link'
import { apiUrl } from '../config/constant';
import Data from './Data';

export const metadata = {
    title: "Medipedia Guide",
};

export default async function page() {
    const data = await getData()
    // console.log(data)

    return (

        <section className="courses-category-area ptb-50">
            <h1 className="text-center">Medipedia Guide</h1>
            <br />
            <div className="container mw-1470">
                <div className="col col-lg-12 row">
                    <Data value={data} ></Data>
                </div>
            </div>
        </section>


    )
}


async function getData() {
    const res = await fetch(`${apiUrl}/speclization.php`, {
        cache: 'no-store'
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

import React from 'react'
import Link from 'next/link'
import { apiUrl } from '../config/constant';
import Data from './Data';

export const metadata = {
    title: 'Book Prices - Medipedia',
}

export default async function page() {
    const data = await getData()

    return (
        <section className="event-details-section">
            <div className="container mw-1470">
                <div className="ptb-50" >
                    <div className='d-flex justify-content-center align-items-center' style={{ flexDirection: "column", gap: '8px' }}>
                        <h1 className="text-center">Books Prices</h1>
                        <div className='text-center' style={{
                            padding: '12px 30px',
                            background: '#19B2EE',
                            color: 'white',
                            borderRadius: '10px',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            boxShadow: '0 4px 15px rgba(25, 178, 238, 0.3)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>
                            Version 01
                        </div>
                    </div>
                    <br />
                    <Data bookcode1Price={data.bookcode1Price} bookcode2Price={data.bookcode2Price} mockcode3Price={data.mockcode3Price} mockcode4Price={data.mockcode4Price} bookBundle2={data.bookBundle2} bookBundle1={data.bookBundle1} books={data.books} mockBundle1={data.mockBundle1} mockBundle2={data.mockBundle2}  ></Data>

                    <div className='d-flex justify-content-center align-items-center' style={{ flexDirection: "column", gap: '12px', padding: '30px 0', position: 'relative' }}>
                        {/* Decorative element */}


                        {/* Version badge with gradient and shadow */}
                        <div className='text-center' style={{
                            padding: '12px 30px',
                            background: '#19B2EE',
                            color: 'white',
                            borderRadius: '10px',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            boxShadow: '0 4px 15px rgba(25, 178, 238, 0.3)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>
                            Version 02
                        </div>

                        {/* Content card */}
                        <div style={{
                            backgroundColor: '#ECF2FC', // The requested color option
                            borderRadius: '16px',
                            padding: '24px 40px',
                            marginTop: '8px',
                            border: '1px solid #D3E0F5', // Soft border slightly darker than the background
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)', // Softer, more modern shadow
                            maxWidth: '600px',
                            width: '100%',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s ease-in-out' // Smooth hover potential
                        }}>
                            <p style={{
                                color: '#19B2EE', // Deep blue for a premium contrast
                                fontSize: '18px',
                                marginBottom: '6px',
                                fontWeight: '700',
                                textTransform: 'uppercase', // Gives it a "badge" or "premium" feel
                                letterSpacing: '0.5px'
                            }}>
                                Premium Access
                            </p>

                            <p style={{
                                color: '#475569', // Slate gray for readability
                                fontSize: '15px',
                                margin: '0',
                                fontWeight: '500'
                            }}>
                                All Books prices = <span style={{
                                    color: '#19B2EE', // Bright blue to highlight the price
                                    fontWeight: '800',
                                    fontSize: '17px',
                                    backgroundColor: '#FFFFFF',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    marginLeft: '4px'
                                }}>
                                    500
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}


async function getData() {
    const res = await fetch(`${apiUrl}/book-prices.php`, {
        cache: 'no-store'
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

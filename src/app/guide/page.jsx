'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiUrl } from '../config/constant';
import Data from './Data';

export default function Page() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    user_id: '',
    user_name: '',
    user_email: '',
    user_no: '',
  });

  // Take the identity from the NextAuth session
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;

    const nextUser = {
      user_id: String(session.user.id),
      user_name: session.user.name || '',
      user_email: session.user.email || '',
      user_no: session.user.user_no || '',
    };
    setUserData(nextUser);
  }, [status, session?.user?.id]);

  async function fetchData() {
    try {
      const res = await fetch(`${apiUrl}/speclization.php`, {
        cache: 'no-store'
      });
      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Something went wrong. Please try again');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="courses-category-area ptb-50">
        <div className="container mw-1470">
          <div className="text-center" style={{ padding: '50px 0' }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #19B2EE',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '20px', color: '#6c757d' }}>Loading...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="courses-category-area ptb-50">
        <h1 className="text-center">Something went wrong. Please try again</h1>
        <br />
        <div className="container mw-1470">
          <div className="col col-lg-12 row">
            {error || 'Oops, there was an issue fetching the data.'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="courses-category-area ptb-50">
      <div className="container mw-1470">
        <h1 className="text-center" style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#0C7399',
          marginBottom: '10px'
        }}>
          Medipedia Guide
        </h1>
        <p className="text-center" style={{ 
          color: '#6c757d', 
          fontSize: '1.1rem',
          marginBottom: '40px'
        }}>
          Explore the complete guide
        </p>
        
        <div className="col col-lg-12 row">
          <Data value={data} />
        </div>
      </div>
    </section>
  );
}
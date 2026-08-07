"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { apiUrl, profiledata } from '../config/constant';

export default function Username() {
    const { data: session, status } = useSession();
    const [name, setname] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (session && session.user) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const data = await profiledata(session.user.id);
                    
                    // SAFE: Check if data exists before accessing
                    if (data && data.user_name) {
                        setname(data.user_name);
                    } else if (data && data.name) {
                        // Fallback if using different field name
                        setname(data.name);
                    } else {
                        console.warn('No user_name in response:', data);
                        setname('User'); // Fallback name
                    }
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                    setError(error.message);
                    setname('User'); // Fallback name
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            setLoading(false);
        }
    }, [session]);

    if (status === "loading" || loading) {
        return <>Loading...</>;
    }

    if (error) {
        return <>User</>; // Fallback display
    }

    return <>{name || 'User'}</>;
}
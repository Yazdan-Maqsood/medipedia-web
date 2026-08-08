"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
// App Router: must be next/navigation, NOT next/router (that is Pages Router
// only and throws "NextRouter was not mounted" at runtime).
import { useRouter } from "next/navigation";

export function Authentication() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    return null;
}

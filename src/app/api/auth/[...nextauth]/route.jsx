import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { apiUrl } from "@/app/config/constant";

async function login(credentials) {
    try {
        const formData = new FormData();
        formData.append("user_email", credentials.email);
        formData.append("user_pass", credentials.password);
        
        // ✅ Correct URL - without .php
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            body: formData,
        });

        // Get response text
        const responseText = await response.text();
        console.log("Raw login response:", responseText);

        // Parse JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse JSON:", responseText);
            throw new Error("Invalid response from server");
        }

        if (!response.ok) {
            throw new Error(data.error || "Authentication failed");
        }

        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw new Error(error.message);
    }
}

export const authOptions = {
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log("Missing credentials");
                        return null;
                    }

                    const user = await login(credentials);
                    console.log("User data from backend:", user);

                    // ✅ Check if user exists and has data
                    if (user && user.id && user.success !== false) {
                        const loggedInUser = {
                            id: user.id.toString(), // Convert to string for NextAuth
                            email: user.user_email,
                            name: user.user_name,
                            user_no: user.user_no,
                            is_verified: user.is_verified,
                            status: user.status
                        };
                        console.log("Authorize success:", loggedInUser);
                        return loggedInUser;
                    } else {
                        console.log("Authorize failed:", user?.error || "No user data");
                        return null;
                    }
                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.user_no = user.user_no;
                token.is_verified = user.is_verified;
                token.status = user.status;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.user_no = token.user_no;
                session.user.is_verified = token.is_verified;
                session.user.status = token.status;
            }
            return session;
        }
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
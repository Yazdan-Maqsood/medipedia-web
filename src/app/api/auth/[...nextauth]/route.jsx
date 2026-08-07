import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { apiUrl } from "@/app/config/constant";

async function login(credentials) {
    try {
        console.log("1. Login function called with:", credentials);
        
        const formData = new FormData();
        formData.append("user_email", credentials.email);
        formData.append("user_pass", credentials.password);
        
        const loginUrl = `${apiUrl}/login`;
        console.log("2. Fetching URL:", loginUrl);
        
        const response = await fetch(loginUrl, {
            method: "POST",
            body: formData,
        });

        console.log("3. Response status:", response.status);
        
        const responseText = await response.text();
        console.log("4. Raw response:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
            console.log("5. Parsed data:", data);
        } catch (e) {
            console.error("6. Failed to parse JSON:", responseText);
            throw new Error("Invalid response from server");
        }

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        if (!data.id) {
            console.error("7. No ID in response:", data);
            throw new Error("No user ID returned");
        }

        console.log("8. Login successful!");
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
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
                    console.log("A. Authorize called with:", credentials);
                    
                    if (!credentials?.email || !credentials?.password) {
                        console.log("B. Missing credentials");
                        return null;
                    }

                    const user = await login(credentials);
                    console.log("C. User from login:", user);

                    if (user && user.id) {
                        const loggedInUser = {
                            id: String(user.id),
                            email: user.user_email,
                            name: user.user_name,
                            user_no: user.user_no,
                            is_verified: user.is_verified,
                            status: user.status
                        };
                        console.log("D. Returning user:", loggedInUser);
                        return loggedInUser;
                    } else {
                        console.log("E. No valid user data:", user);
                        return null;
                    }
                } catch (error) {
                    console.error("F. Authorize error:", error);
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
            console.log("JWT callback:", { token, user });
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
            console.log("Session callback:", { session, token });
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
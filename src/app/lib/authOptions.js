import CredentialsProvider from "next-auth/providers/credentials";
import { apiUrl } from "@/app/config/constant";

/**
 * Single source of truth for the NextAuth configuration.
 *
 * IMPORTANT: this MUST live outside `app/api/auth/[...nextauth]/route.jsx`.
 * A `route.js` file in the App Router is only allowed to export HTTP method
 * handlers, so `export const authOptions` from there is silently dropped in a
 * production build. When that happens `getServerSession(authOptions)` receives
 * `undefined`, the `session` callback below never runs, and `session.user.id`
 * comes back undefined -> every page posts `user_id=undefined` to the PHP API
 * and renders empty.
 */
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const formData = new FormData();
                formData.append("user_email", credentials.email);
                formData.append("user_pass", credentials.password);

                let response;
                try {
                    response = await fetch(`${apiUrl}/login.php`, {
                        method: "POST",
                        body: formData,
                        cache: "no-store",
                    });
                } catch (error) {
                    console.error("[auth] login.php unreachable:", error);
                    throw new Error("Cannot reach the server. Please try again.");
                }

                const rawResponse = await response.text();

                let userData;
                try {
                    userData = JSON.parse(rawResponse);
                } catch (e) {
                    // PHP fatal errors / HTML error pages land here.
                    console.error("[auth] login.php returned non-JSON:", rawResponse.slice(0, 500));
                    throw new Error("Server error. Please try again later.");
                }

                if (!response.ok || userData?.success === false) {
                    throw new Error(userData?.error || "Invalid email or password");
                }

                if (!userData?.id) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: String(userData.id),
                    email: userData.user_email,
                    name: userData.user_name,
                    user_no: userData.user_no || "",
                    is_verified: userData.is_verified ?? 0,
                    status: userData.status ?? 0,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.user_no = user.user_no;
                token.is_verified = user.is_verified;
                token.status = user.status;
            }

            // Supports `update({ ... })` from useSession() after profile edits.
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                if (session.email) token.email = session.email;
                if (session.user_no) token.user_no = session.user_no;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = session.user || {};
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.user_no = token.user_no;
                session.user.is_verified = token.is_verified;
                session.user.status = token.status;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;

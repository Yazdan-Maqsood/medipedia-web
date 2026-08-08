import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log("🔐 Authorize called with:", credentials?.email);
                    
                    if (!credentials?.email || !credentials?.password) {
                        console.log("❌ Missing credentials");
                        return null;
                    }

                    // Create FormData
                    const formData = new FormData();
                    formData.append("user_email", credentials.email);
                    formData.append("user_pass", credentials.password);

                    // Call your backend
                    const response = await fetch("https://medipedia-web-api.desired-techs.com/login", {
                        method: "POST",
                        body: formData,
                    });

                    console.log("📡 Response status:", response.status);

                    // Get raw response
                    const rawResponse = await response.text();
                    console.log("📝 Raw response:", rawResponse);

                    // Parse JSON
                    let userData;
                    try {
                        userData = JSON.parse(rawResponse);
                    } catch (e) {
                        console.error("❌ Failed to parse JSON:", rawResponse);
                        return null;
                    }

                    // Check if login was successful
                    if (!response.ok) {
                        console.log("❌ Login failed:", userData.error || "Unknown error");
                        return null;
                    }

                    // Check if user data is valid
                    if (!userData.id) {
                        console.log("❌ No ID in response:", userData);
                        return null;
                    }

                    // Return user object for NextAuth
                    const user = {
                        id: String(userData.id),
                        email: userData.user_email,
                        name: userData.user_name,
                        user_no: userData.user_no || "",
                        is_verified: userData.is_verified || 0,
                        status: userData.status || 0,
                    };

                    console.log("✅ Login successful:", user);
                    return user;

                } catch (error) {
                    console.error("❌ Authorize error:", error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
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
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
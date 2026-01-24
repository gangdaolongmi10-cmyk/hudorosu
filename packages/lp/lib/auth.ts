import { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Session型の拡張
declare module "next-auth" {
    interface Session {
        user: {
            id: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
    }
}

import pool from "./db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Authorize called with:", credentials?.email)
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials")
                    return null
                }

                try {
                    const { rows: users } = await pool.query(
                        'SELECT id, email, name FROM users WHERE email = $1',
                        [credentials.email]
                    )

                    if (users.length === 0) {
                        console.log("User not found in DB")
                        throw new Error("USER_NOT_FOUND")
                    }

                    const user = users[0]
                    console.log("User found:", user.id)

                    const { rows: auths } = await pool.query(
                        'SELECT password_hash FROM local_auth WHERE user_id = $1',
                        [user.id]
                    )

                    if (auths.length === 0) {
                        console.log("No local_auth found for user")
                        throw new Error("WRONG_PASSWORD")
                    }

                    const isValid = await bcrypt.compare(credentials.password, auths[0].password_hash)
                    console.log("Password valid:", isValid)

                    if (!isValid) {
                        throw new Error("WRONG_PASSWORD")
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                    }
                } catch (error) {
                    console.error("Authorize error:", error)
                    throw error
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only",
}

"use client"
import { AuthForm } from "@/components/auth-form"

export default function AuthPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/modern-auto-garage.png')`,
          opacity: 0.3,
        }}
      />

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <AuthForm />
      </div>
    </div>
  )
}

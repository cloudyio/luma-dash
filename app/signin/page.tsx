"use client"

import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export default function SignIn() {
  const handleSignIn = useCallback(async () => {
    await signIn("discord", { callbackUrl: "/dashboard" });
  }, []);

  return (
    <div className="flex flex-col min-h-screen dark bg-gray-900 text-gray-100 items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-2xl md:text-2xl lg:text-2xl">
            Sign In
          </h1>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <Button size="lg" className="w-full" onClick={handleSignIn}>
              Sign In with Discord
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
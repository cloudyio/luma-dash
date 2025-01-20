import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="flex flex-col min-h-screen dark bg-gray-900 text-gray-100 items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-2xl md:text-2xl lg:text-2xl">
            Sign In
          </h1>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <form
              action={async () => {
                "use server";
                await signIn("discord", { redirectTo: "/dashboard" });
              }}
            >
              <Button type="submit" size="lg" className="w-full">Sign In with Discord</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import { Github, Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign up user:", values.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      console.log("Sign up successful:", data);
      toast.success("Account created successfully! Please check your email to verify your account.");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      const authError = error as AuthError;
      toast.error(authError.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Failed to sign up with Google. Please try again.");
    }
  };

  const handleGithubSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("GitHub signup error:", error);
      toast.error("Failed to sign up with GitHub. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Create an account
          </h1>
          <p className="text-sm text-gray-600">
            Sign up to get started with our application
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGithubSignUp}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
            Or continue with
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      className="bg-gray-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      className="bg-gray-50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      className="bg-gray-50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className="w-full bg-gray-900 hover:bg-gray-800" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Button
            variant="link"
            className="text-gray-900 hover:text-gray-700 p-0"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
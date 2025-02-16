
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Github, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Clear any existing sessions first
        await supabase.auth.signOut();
        
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          return;
        }
        if (session) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Clear any existing sessions first
      await supabase.auth.signOut();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        throw new Error('Invalid email or password. Please try again.');
      }

      if (!data?.session) {
        throw new Error("No session created. Please try again.");
      }

      toast({
        title: "Success!",
        description: "Signed in successfully.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      // Clear any existing sessions first
      await supabase.auth.signOut();

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error(`${provider} sign in error:`, error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleGoogleSignIn = () => handleOAuthSignIn('google');
  const handleGithubSignIn = () => handleOAuthSignIn('github');

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center p-4">
      <BackButton />
      <Card className="w-full max-w-md bg-white shadow-lg animate-fadeIn">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <form onSubmit={handleEmailSignIn}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#C8C8C9] hover:bg-[#b1b1b2] text-black"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In with Email"}
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
              >
                <Mail className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGithubSignIn}
              >
                <Github className="mr-2 h-4 w-4" /> Github
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="text-gray-900 hover:text-gray-800 p-0"
                onClick={() => navigate("/sign-up")}
              >
                Sign up
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

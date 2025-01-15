import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Github, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Account created successfully. Please sign in.",
      });

      // Redirect to signin page after a short delay
      setTimeout(() => {
        navigate("/signin");
      }, 1500);

    } catch (error: any) {
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

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleGithubSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg animate-fadeIn">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <form onSubmit={handleEmailSignUp}>
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
                  {loading ? "Creating account..." : "Sign Up with Email"}
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
                onClick={handleGoogleSignUp}
              >
                <Mail className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGithubSignUp}
              >
                <Github className="mr-2 h-4 w-4" /> Github
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Button
                variant="link"
                className="text-gray-900 hover:text-gray-800 p-0"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
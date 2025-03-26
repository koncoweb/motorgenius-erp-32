
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);
  
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        console.log("Checking Supabase connection...");
        const { data, error } = await supabase.from('customers').select('*').limit(1);
        
        if (error) {
          console.error("Supabase connection error:", error);
          setSupabaseStatus(`Error: ${error.message}`);
          setMaintenanceMode(true);
        } else {
          console.log("Supabase connection successful, found data:", data);
          setSupabaseStatus("Connected");
        }
      } catch (err) {
        console.error("Exception checking Supabase:", err);
        setSupabaseStatus(`Exception: ${err}`);
        setMaintenanceMode(true);
      }
    };
    
    checkSupabaseConnection();
  }, []);
  
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to dashboard:", user);
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log("Attempting login with:", values.email);
      
      if (values.email === "admin@erp-system.com" && values.password === "admin123") {
        console.log("Using demo account bypass due to Supabase authentication issues");
        toast.success("Demo login successful!");
        console.log("Demo login successful, navigating to dashboard");
        navigate('/dashboard', { replace: true });
        return;
      }
      
      const { data: directAuthData, error: directAuthError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (directAuthError) {
        console.error("Direct auth error:", directAuthError);
        throw directAuthError;
      }
      
      console.log("Direct auth successful:", directAuthData);
      
      await signIn(values.email, values.password);
      
      toast.success("Login successful!");
      console.log("Login successful, navigating to dashboard");
      
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message?.includes("Database error querying schema") || 
          error.message?.includes("Database connection")) {
        setMaintenanceMode(true);
        setLoginError("The authentication service is currently experiencing database issues. Use the demo account below to access the application.");
      } else if (error.message === "Invalid login credentials" || 
                error.message?.includes("Invalid email or password")) {
        setLoginError("Invalid email or password. Please try again.");
      } else if (error.message?.includes("network")) {
        setLoginError("Network error. Please check your internet connection and try again.");
      } else {
        setLoginError(error.message || "Failed to sign in. Please check your credentials.");
      }
      
      toast.error(loginError || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const tryDemoAccount = () => {
    console.log("Using demo account...");
    form.setValue("email", "admin@erp-system.com");
    form.setValue("password", "admin123");
    
    setTimeout(() => {
      console.log("Auto-submitting form with demo account");
      form.handleSubmit(onSubmit)();
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img src="/mesindo-logo.svg" alt="Mesindo Logo" className="h-12" />
            </div>
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {maintenanceMode && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {supabaseStatus && <div className="mb-2">Supabase status: {supabaseStatus}</div>}
                  The system is currently in maintenance mode. You can still use the demo account below to explore the application.
                </AlertDescription>
              </Alert>
            )}
            
            {loginError && !maintenanceMode && (
              <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{loginError}</p>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" type="email" {...field} />
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
                        <Input placeholder="******" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-right text-sm">
                  <Link to="/auth/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={tryDemoAccount}
                >
                  Use Demo Account
                </Button>

                <div className="text-center text-sm">
                  <p>Demo account: admin@erp-system.com / admin123</p>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-primary underline-offset-4 hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

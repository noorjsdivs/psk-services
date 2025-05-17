import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      // confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate("/");
    };

    checkUser();
  }, [navigate]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate("/");
    } catch (error) {
      const err = error as { message: string };
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });

      setMode("login");
    } catch (error) {
      const err = error as { message: string };
      toast({
        title: "Registration failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 md:px-12 flex items-center justify-center">
      <div className="w-full max-w-md glassmorphism p-8 rounded-xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Fill out the form to create a new account"}
          </p>
        </div>

        {mode === "login" ? (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-6"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        {...field}
                        type="email"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        {...field}
                        type="password"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-psyco-green-DEFAULT border border-input hover:bg-psyco-green-dark"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign In"}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-psyco-green-DEFAULT hover:text-psyco-green-light"
                    onClick={() => setMode("signup")}
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(handleSignup)}
              className="space-y-6"
            >
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        {...field}
                        type="password"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-psyco-green-DEFAULT border border-input hover:bg-psyco-green-dark"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-psyco-green-DEFAULT  hover:text-psyco-green-light"
                    onClick={() => setMode("login")}
                    disabled={loading}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Auth;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLogin, useRegister } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      fullName: '',
    },
  });

  const onLogin = async (data: LoginForm) => {
    try {
      await loginMutation.mutateAsync(data);
      toast({
        title: 'Success!',
        description: 'Welcome back to FitPlan!',
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    }
  };

  const onRegister = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync(data);
      toast({
        title: 'Success!',
        description: 'Welcome to FitPlan! Your account has been created.',
      });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Registration failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            FitPlan
          </h1>
          <p className="text-gray-400 mt-2">Transform your fitness journey</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-700/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-gray-600">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-gray-600">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-white">Welcome Back</CardTitle>
                <CardDescription>Sign in to your FitPlan account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-gray-200">Username</Label>
                    <Input
                      id="login-username"
                      {...loginForm.register('username')}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter your username"
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-red-400 text-sm">{loginForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-200">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      {...loginForm.register('password')}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter your password"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="register">
              <CardHeader>
                <CardTitle className="text-white">Create Account</CardTitle>
                <CardDescription>Start your fitness transformation today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-fullName" className="text-gray-200">Full Name (Optional)</Label>
                    <Input
                      id="register-fullName"
                      {...registerForm.register('fullName')}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-gray-200">Username</Label>
                    <Input
                      id="register-username"
                      {...registerForm.register('username')}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Choose a username"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-red-400 text-sm">{registerForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-200">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      {...registerForm.register('email')}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter your email"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-red-400 text-sm">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-200">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      {...registerForm.register('password')}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Create a password"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-red-400 text-sm">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
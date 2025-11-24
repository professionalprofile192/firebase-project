'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EyeOff, Eye, User, Lock } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getLastLoginTime, login } from '@/app/actions';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await login(values);

      if (response.success) {
        toast({
          title: 'Login Successful',
          description: 'Redirecting to your dashboard...',
        });
        
        sessionStorage.setItem('userProfile', JSON.stringify(response.profile));

        // Call the second service to get the last login time
        const loginTimeResponse = await getLastLoginTime(response.profile.userid);
        if (loginTimeResponse.opstatus === 0) {
          const lastLogin = loginTimeResponse.LoginServices[0].Lastlogintime;
          // Store it in session storage to access it on the dashboard page
          sessionStorage.setItem('lastLoginTime', lastLogin);
        }

        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn('w-full max-w-sm flip-card', { 'flipped': isFlipped })}>
        <div className='flip-card-inner' style={{ minHeight: '500px' }}>
            <div className='flip-card-front'>
                <Card className="w-full h-full border-none bg-white/80 text-card-foreground shadow-2xl backdrop-blur-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold tracking-tight">
                        Sign In
                        </CardTitle>
                        <CardDescription>
                        Enter your credentials to sign in to UBL Digital.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex-1'>
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username:</FormLabel>
                                <FormControl>
                                    <Input
                                    className="h-12 text-base bg-white/50"
                                    placeholder="Enter Username"
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
                                <FormLabel>Password:</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        className="h-12 pr-10 text-base bg-white/50"
                                        placeholder="Enter Password"
                                        {...field}
                                    />
                                    </FormControl>
                                    <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    >
                                    {showPassword ? (
                                        <Eye className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    </button>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button
                            type="submit"
                            className="w-full py-6 text-base font-semibold"
                            disabled={isSubmitting}
                            >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2">
                        <button
                        type='button'
                        onClick={() => setIsFlipped(true)}
                        className="text-sm font-medium text-primary hover:underline"
                        >
                        Forgot your credentials?
                        </button>
                        <button
                        type="button"
                        className="text-sm font-medium text-gray-700 hover:underline"
                        >
                        Corporate Enroll
                        </button>
                    </CardFooter>
                </Card>
            </div>
            <div className='flip-card-back'>
                <Card className="w-full h-full border-none bg-white/80 text-card-foreground shadow-2xl backdrop-blur-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold tracking-tight">Forgot Credentials</CardTitle>
                        <CardDescription>Select an option to recover your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center gap-4">
                        <button className="w-full text-left p-4 rounded-lg bg-white/80 hover:bg-white transition-all shadow-md">
                            <div className='flex items-start gap-4'>
                                <User className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg">Recover Username</h3>
                                    <p className="text-sm text-muted-foreground">To view your username and unlock your mobile account, confirm your account details.</p>
                                </div>
                            </div>
                        </button>
                         <button className="w-full text-left p-4 rounded-lg bg-white/80 hover:bg-white transition-all shadow-md">
                            <div className='flex items-start gap-4'>
                                <Lock className="h-6 w-6 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-lg">Reset Password</h3>
                                    <p className="text-sm text-muted-foreground">To view your username and unlock your mobile account, confirm your personal and account details.</p>
                                </div>
                            </div>
                        </button>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" onClick={() => setIsFlipped(false)}>Go Back</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}

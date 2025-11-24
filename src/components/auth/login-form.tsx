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
import { EyeOff, Eye, User, Lock, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getLastLoginTime, login } from '@/app/actions';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const recoverUsernameFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    mobileNumber: z.string().min(1, { message: 'Mobile number is required.' }),
    captcha: z.string().min(1, { message: 'Captcha is required.' }),
});

type View = 'signIn' | 'forgotOptions' | 'recoverUsername' | 'recoverPassword';


function ForgotCredentialsOptions({ setView }: { setView: (view: View) => void }) {
    return (
        <>
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">Forgot Credentials</CardTitle>
                <CardDescription>Select an option to recover your account.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center gap-4">
                <button 
                    onClick={() => setView('recoverUsername')}
                    className="w-full text-left p-4 rounded-lg bg-white/80 hover:bg-white transition-all shadow-md">
                    <div className='flex items-start gap-4'>
                        <User className="h-6 w-6 text-primary" />
                        <div>
                            <h3 className="font-semibold text-lg">Recover Username</h3>
                            <p className="text-sm text-muted-foreground">To view your username and unlock your mobile account, confirm your account details.</p>
                        </div>
                    </div>
                </button>
                    <button onClick={() => setView('recoverPassword')} className="w-full text-left p-4 rounded-lg bg-white/80 hover:bg-white transition-all shadow-md">
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
                <Button variant="link" onClick={() => setView('signIn')}>Go Back</Button>
            </CardFooter>
        </>
    );
}

function RecoverUsernameForm({ setView }: { setView: (view: View) => void }) {
    const form = useForm<z.infer<typeof recoverUsernameFormSchema>>({
        resolver: zodResolver(recoverUsernameFormSchema),
        defaultValues: {
          email: '',
          mobileNumber: '',
          captcha: '',
        },
    });

    function onSubmit(values: z.infer<typeof recoverUsernameFormSchema>) {
        console.log(values);
        // Handle form submission
    }

    return (
        <>
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">Recover Username</CardTitle>
                <CardDescription>Let's verify it's you</CardDescription>
            </CardHeader>
            <CardContent className='flex-1 flex flex-col'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col flex-1">
                        <div className="flex-1 space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Email Address" {...field} className="h-12 text-base bg-white/50" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mobileNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Mobile Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Registered Mobile Number" {...field} className="h-12 text-base bg-white/50" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="captcha"
                                render={({ field }) => (
                                    <FormItem>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <FormLabel>Captcha</FormLabel>
                                            <div className='flex items-center gap-2'>
                                                <div className="bg-gray-200 p-2 rounded-md flex-grow">
                                                    <Image src="https://placehold.co/150x50/e2e8f0/000000?text=gZAa5&font=source-sans-pro" alt="Captcha" width={150} height={50} className='w-full' />
                                                </div>
                                                <Button variant="ghost" size="icon">
                                                    <RefreshCw className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Input placeholder="Enter the above captcha here" {...field} className="mt-2 h-12 text-base bg-white/50" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full py-6 text-base font-semibold bg-black text-white hover:bg-black/80"
                        >
                            Next
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                 <Button variant="link" onClick={() => setView('forgotOptions')}>Go Back</Button>
            </CardFooter>
        </>
    );
}

const recoverPasswordFormSchema = z.object({
    loginId: z.string().min(1, { message: 'Login ID is required' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    captcha: z.string().min(1, { message: 'Captcha is required.' }),
});

function RecoverPasswordForm({ setView }: { setView: (view: View) => void }) {
    const form = useForm<z.infer<typeof recoverPasswordFormSchema>>({
        resolver: zodResolver(recoverPasswordFormSchema),
        defaultValues: {
            loginId: '',
            email: '',
            captcha: '',
        },
    });

    function onSubmit(values: z.infer<typeof recoverPasswordFormSchema>) {
        console.log(values);
        // Handle form submission
    }

    return (
        <>
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">Reset Password</CardTitle>
                <CardDescription>Let's verify it's you</CardDescription>
            </CardHeader>
            <CardContent className='flex-1 flex flex-col'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col flex-1">
                        <div className="flex-1 space-y-4">
                            <FormField
                                control={form.control}
                                name="loginId"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Login ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Login ID" {...field} className="h-12 text-base bg-white/50" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Email Address" {...field} className="h-12 text-base bg-white/50" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="captcha"
                                render={({ field }) => (
                                    <FormItem>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <FormLabel>Captcha</FormLabel>
                                            <div className='flex items-center gap-2'>
                                                <div className="bg-gray-200 p-2 rounded-md flex-grow">
                                                    <Image src="https://placehold.co/150x50/e2e8f0/000000?text=aBCdE&font=source-sans-pro" alt="Captcha" width={150} height={50} className='w-full' />
                                                </div>
                                                <Button variant="ghost" size="icon">
                                                    <RefreshCw className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Input placeholder="Enter the above captcha here" {...field} className="mt-2 h-12 text-base bg-white/50" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full py-6 text-base font-semibold bg-black text-white hover:bg-black/80"
                        >
                            Next
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                 <Button variant="link" onClick={() => setView('forgotOptions')}>Go Back</Button>
            </CardFooter>
        </>
    );
}

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<View>('signIn');
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSetView = (newView: View) => {
    setView(newView);
  }

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
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
    <div className={cn('w-full max-w-sm flip-card', { 'flipped': view !== 'signIn' })}>
        <div className='flip-card-inner' style={{ minHeight: '620px' }}>
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
                        onClick={() => handleSetView('forgotOptions')}
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
                    {view === 'forgotOptions' && <ForgotCredentialsOptions setView={handleSetView} />}
                    {view === 'recoverUsername' && <RecoverUsernameForm setView={handleSetView} />}
                    {view === 'recoverPassword' && <RecoverPasswordForm setView={handleSetView} />}
                </Card>
            </div>
        </div>
    </div>
  );
}

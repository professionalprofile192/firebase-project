
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
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendOtpForUsernameRecovery, validateUser, verifyOtp, forgotUsername, login, getLastLoginTime, getAccounts } from '@/app/actions';
import { cn } from '@/lib/utils';
import { OtpDialog } from './otp-dialog';
import { CustomAlertDialog } from '../common/custom-alert-dialog';

// ---------------- SCHEMAS ---------------------

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const recoverUsernameFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  mobileNumber: z.string().min(1, { message: 'Mobile number is required.' }),
});

const recoverPasswordFormSchema = z.object({
  loginId: z.string().min(1, { message: 'Login ID is required' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

const corporateEnrollFormSchema = z.object({
  tempLoginId: z.string().min(1, { message: 'Temporary Login ID is required' }),
  tempPassword: z.string().min(1, { message: 'Temporary Password is required' }),
});

type View = 'signIn' | 'forgotOptions' | 'recoverUsername' | 'recoverPassword' | 'corporateEnroll';
type RecoverUsernameValues = z.infer<typeof recoverUsernameFormSchema>;
type RecoverPasswordValues = z.infer<typeof recoverPasswordFormSchema>;
type RecoveryFlow = 'username' | 'password';


// ---------------- COMPONENTS ---------------------

function CorporateEnrollForm({ setView }: { setView: (view: View) => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof corporateEnrollFormSchema>>({
      resolver: zodResolver(corporateEnrollFormSchema),
      defaultValues: {
        tempLoginId: '',
        tempPassword: '',
      },
    });

    function onSubmit(values: z.infer<typeof corporateEnrollFormSchema>) {
      console.log(values);
    }
  
    return (
      <>
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Activate your account</CardTitle>
          <CardDescription>Enter Temporary ID & Password</CardDescription>
        </CardHeader>
  
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* tempLoginId */}
              <FormField
                control={form.control}
                name="tempLoginId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporary Login ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Temporary Login ID" {...field} className="h-12 text-base bg-white/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              {/* tempPassword */}
              <FormField
                control={form.control}
                name="tempPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Temporary Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          className="h-12 pr-10 text-base bg-white/50"
                          placeholder="Enter Temporary Password"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <Button type="submit" className="w-full py-6 text-base font-semibold bg-black text-white hover:bg-black/80">
                Verify
              </Button>
            </form>
          </Form>
        </CardContent>
  
        <CardFooter>
          <Button variant="link" onClick={() => setView('signIn')}>Go Back</Button>
        </CardFooter>
      </>
    );
  }

function ForgotCredentialsOptions({ setView }: { setView: (view: View) => void }) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">Forgot Credentials</CardTitle>
        <CardDescription>Select an option to recover your account.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <button
          onClick={() => setView('recoverUsername')}
          className="w-full text-left p-4 rounded-lg bg-white/80 hover:bg-white transition-all shadow-md"
        >
          <div className="flex items-start gap-4">
            <User className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">Recover Username</h3>
              <p className="text-sm text-muted-foreground">
                Verify your account details to view your username.
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setView('recoverPassword')}
          className="w-full text-left p-4 rounded-lg bg-white/80 hover:bg-white transition-all shadow-md"
        >
          <div className="flex items-start gap-4">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">Reset Password</h3>
              <p className="text-sm text-muted-foreground">
                Verify your details to reset your password.
              </p>
            </div>
          </div>
        </button>
      </CardContent>

      <CardFooter>
        <Button variant="link" onClick={() => setView('signIn')}>
          Go Back
        </Button>
      </CardFooter>
    </>
  );
}

function RecoverUsernameForm({ setView, onOtpRequest }: { setView: (view: View) => void, onOtpRequest: (values: RecoverUsernameValues) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof recoverUsernameFormSchema>>({
    resolver: zodResolver(recoverUsernameFormSchema),
    defaultValues: {
      email: '',
      mobileNumber: '',
    },
  });

  async function onSubmit(values: z.infer<typeof recoverUsernameFormSchema>) {
    setIsSubmitting(true);
    try {
        await onOtpRequest(values);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Please try again later.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">Recover Username</CardTitle>
        <CardDescription>Let's verify it's you</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* email */}
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

            {/* mobile number */}
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

            <Button type="submit" className="w-full py-6 text-base font-semibold bg-black text-white hover:bg-black/80" disabled={isSubmitting}>
              {isSubmitting ? 'Sending OTP...' : 'Next'}
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

function RecoverPasswordForm({ setView, onValidateUser }: { setView: (view: View) => void, onValidateUser: (values: RecoverPasswordValues) => void; }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof recoverPasswordFormSchema>>({
    resolver: zodResolver(recoverPasswordFormSchema),
    defaultValues: {
      loginId: '',
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof recoverPasswordFormSchema>) {
    setIsSubmitting(true);
    try {
        await onValidateUser(values);
    } catch (error) {
         toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Please try again later.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">Reset Password</CardTitle>
        <CardDescription>Let's verify it's you</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* loginId */}
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

            {/* email */}
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
            
            <Button type="submit" className="w-full py-6 text-base font-semibold bg-black text-white hover:bg-black/80" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Next'}
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



// ---------------- LOGIN FORM (RIGHT-SIDE ONLY) ---------------------

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<View>('signIn');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showResultAlert, setShowResultAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [recoveryDetails, setRecoveryDetails] = useState<RecoverUsernameValues | null>(null);
  const [currentFlow, setCurrentFlow] = useState<RecoveryFlow>('username');

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSetView = (newView: View) => setView(newView);

  const handleOtpRequest = async (values: RecoverUsernameValues) => {
    setCurrentFlow('username');
    const response = await sendOtpForUsernameRecovery(values);
    if (response.opstatus === 0) {
        toast({
            title: "OTP Sent",
            description: "An OTP has been sent to your registered details.",
        });
        setRecoveryDetails(values);
        setShowOtpDialog(true);
    } else {
        setAlertTitle("Error");
        setAlertMessage(response.message || "Could not process your request.");
        setShowResultAlert(true);
    }
  }

  const handleValidateUser = async (values: RecoverPasswordValues) => {
    const response = await validateUser(values);
    if (response.opstatus === 0 && response.ForgotServices.length > 0) {
        setCurrentFlow('password');
        const userDetails = response.ForgotServices[0];
        const otpPayload = { email: userDetails.email, mobileNumber: userDetails.phone };
        
        const otpResponse = await sendOtpForUsernameRecovery(otpPayload);
        if (otpResponse.opstatus === 0) {
            toast({ title: "OTP Sent", description: "An OTP has been sent for password recovery." });
            setRecoveryDetails(otpPayload);
            setShowOtpDialog(true);
        } else {
            setAlertTitle("Error");
            setAlertMessage(otpResponse.message || "Failed to send OTP.");
            setShowResultAlert(true);
        }

    } else {
        setAlertTitle("Error");
        setAlertMessage(response.message || "User does not exist.");
        setShowResultAlert(true);
    }
  }

  const handleOtpConfirm = async (otp: string) => {
    if (!recoveryDetails) return;

    try {
        const verifyResponse = await verifyOtp({
            otp: otp,
            email: recoveryDetails.email,
            mobileNumber: recoveryDetails.mobileNumber,
        });
        
        setShowOtpDialog(false);

        if (verifyResponse.opstatus === 0 && verifyResponse.isOtpVerified === "true") {
            if (currentFlow === 'username') {
                const forgotUsernameResponse = await forgotUsername(recoveryDetails) as any;
                setAlertTitle("Alert");
                setAlertMessage(forgotUsernameResponse.errmsg || forgotUsernameResponse.message || "An unexpected error occurred.");
                setShowResultAlert(true);
            } else {
                setAlertTitle("Success");
                setAlertMessage("OTP Verified successfully. You can now reset your password."); // Placeholder for next step
                setShowResultAlert(true);
            }
        } else {
            setAlertTitle("Error");
            setAlertMessage(verifyResponse.message || "Provided OTP is incorrect.");
            setShowResultAlert(true);
        }
    } catch (error) {
        setShowOtpDialog(false);
        setAlertTitle("Verification Failed");
        setAlertMessage("An error occurred during the recovery process.");
        setShowResultAlert(true);
    }
  };

  const handleAlertClose = () => {
    setShowResultAlert(false);
    setRecoveryDetails(null);
    setView('signIn'); // Go back to the sign in form
  }

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsSubmitting(true);

    try {
      const response = await login(values);

      if (response.success && response.profile) {
        // Store user data in sessionStorage
        sessionStorage.setItem('userProfile', JSON.stringify(response.profile));

        // Fetch additional data and store it
        const loginTimeResponse = await getLastLoginTime(response.profile.userid);
        if (loginTimeResponse.opstatus === 0) {
            sessionStorage.setItem('lastLoginTime', loginTimeResponse.LoginServices[0].Lastlogintime);
        }
        
        const accountsData = await getAccounts(response.profile.userid, response.profile.CIF_NO);
        if (accountsData.opstatus === 0) {
            sessionStorage.setItem('accounts', JSON.stringify(accountsData.payments));
        }

        toast({
          title: 'Login Successful',
          description: 'Redirecting to your dashboard...',
        });
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

  // ⭐ FINAL LAYOUT (RIGHT SIDE ONLY — MATCHES YOUR NEED)
  return (
    <>
      <div className="w-full h-full flex md:pt-0">

        <div
          className={cn(
            'w-full max-w-sm flip-card',
            { flipped: view !== 'signIn' }
          )}
        >
          <div className="flip-card-inner">

            {/* FRONT */}
            <div className="flip-card-front">
              <Card className="w-full border-none bg-white md:bg-white/80 shadow-none md:shadow-xl relative md:rounded-lg" >
                <CardHeader>
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    Sign In
                  </CardTitle>
                  <CardDescription>
                    Enter your credentials to sign in to UBL Digital.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                      {/* USERNAME */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username:</FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 text-base bg-gray-100 md:bg-white/50"
                                placeholder="Enter Username"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* PASSWORD */}
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
                                  className="h-12 pr-10 text-base bg-gray-100 md:bg-white/50"
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
                                  <Eye className="h-5 w-5" />
                                ) : (
                                  <EyeOff className="h-5 w-5" />
                                )}
                              </button>
                            </div>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* SUBMIT */}
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
                    type="button"
                    onClick={() => handleSetView('forgotOptions')}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot your credentials?
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetView('corporateEnroll')}
                    className="text-sm font-medium text-gray-700 hover:underline"
                  >
                    Corporate Enroll
                  </button>
                </CardFooter>
              </Card>
            </div>

            {/* BACK */}
            <div className="flip-card-back">
              <Card
                className="w-full border-none bg-white  bg-white/80 shadow-lg md:shadow-xl  md:rounded-lg"
              >
                {view === 'forgotOptions' && (
                  <ForgotCredentialsOptions setView={handleSetView} />
                )}
                {view === 'recoverUsername' && (
                  <RecoverUsernameForm setView={handleSetView} onOtpRequest={handleOtpRequest} />
                )}
                {view === 'recoverPassword' && (
                  <RecoverPasswordForm setView={handleSetView} onValidateUser={handleValidateUser}/>
                )}
                {view === 'corporateEnroll' && (
                  <CorporateEnrollForm setView={handleSetView} />
                )}
              </Card>
            </div>

          </div>
        </div>

      </div>

      <OtpDialog 
        open={showOtpDialog}
        onOpenChange={setShowOtpDialog}
        onConfirm={handleOtpConfirm}
      />
      <CustomAlertDialog
        open={showResultAlert}
        onOpenChange={setShowResultAlert}
        title={alertTitle}
        description={alertMessage}
        onConfirm={handleAlertClose}
      />
    </>
  );
}

    

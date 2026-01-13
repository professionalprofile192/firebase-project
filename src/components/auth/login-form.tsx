
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      // Check karein agar response okay nahi hai
      if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Invalid credentials");
      }
  
      const data = await res.json();
      console.log("LOGIN API RESPONSE:", data);
  
      // Validation: Profile aur Token dono lazmi honay chahiye
      if (!data?.profile || !data?.claims_token) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: data?.message || "Invalid server response. Please try again.",
        });
        return;
      }
  
      // Save Data - safely check if claims_token is object or string
      const cToken = typeof data.claims_token === 'object' ? data.claims_token.value : data.claims_token;
      
      sessionStorage.setItem("userProfile", JSON.stringify(data.profile));
      sessionStorage.setItem("claimsToken", cToken);
      sessionStorage.setItem("providerToken", data.provider_token?.value || data.provider_token || "");
  
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });
  
      // Final Redirect
      router.push("/dashboard");
  
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  // ⭐ FINAL LAYOUT (RIGHT SIDE ONLY — MATCHES YOUR NEED)
  return (
    <>
      <div className="w-full h-full flex items-center justify-center p-4">
        <div
          className={cn(
            'w-full max-w-[480px] flip-card mx-auto',
            { flipped: view !== 'signIn' }
          )}
        >
          <div className="flip-card-inner">

            {/* FRONT - LOGIN CARD */}
            <div className="flip-card-front">
            <Card className="w-full border-none bg-white/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-3xl font-bold tracking-tight text-[#00529B]">
                    Sign In
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Enter your credentials to access UBL Digital.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                      {/* USERNAME */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">Username</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#00529B] transition-colors" />
                                <Input
                                  className="h-12 pl-10 text-base bg-white/50 border-white/30 focus:bg-white/80 focus:ring-[#00529B]/20 transition-all rounded-xl shadow-sm"
                                  placeholder="Enter Username"
                                  {...field}
                                />
                              </div>
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
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">Password</FormLabel>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#00529B] transition-colors" />
                              <FormControl>
                                <Input
                                  type={showPassword ? 'text' : 'password'}
                                  className="h-12 pl-10 pr-10 text-base bg-white/50 border-white/30 focus:bg-white/80 focus:ring-[#00529B]/20 transition-all rounded-xl shadow-sm"
                                  placeholder="Enter Password"
                                  {...field}
                                />
                              </FormControl>
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* SUBMIT BUTTON */}
                      <Button
                        type="submit"
                        className="w-full py-6 text-base font-semibold bg-[#00529B] hover:bg-[#003d75] text-white rounded-xl shadow-lg shadow-[#00529B]/20 transition-all duration-300 transform hover:-translate-y-0.5"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            Signing In...
                          </span>
                        ) : 'Sign In'}
                      </Button>

                    </form>
                  </Form>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pb-8">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                  <div className="flex w-full justify-between px-1">
                    <button
                      type="button"
                      onClick={() => handleSetView('forgotOptions')}
                      className="text-xs font-semibold text-[#00529B] hover:underline"
                    >
                      Forgot Credentials?
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetView('corporateEnroll')}
                      className="text-xs font-semibold text-gray-600 hover:underline underline-offset-4"
                    >
                      Corporate Enroll
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* BACK - OPTIONS CARD (Same Glass Look) */}
            <div className="flip-card-back">
            <Card className="w-full border-none bg-white/50 backdrop-blur-xl shadow-2xl rounded-[2.5rem]">
                {view === 'forgotOptions' && <ForgotCredentialsOptions setView={handleSetView} />}
                {view === 'recoverUsername' && <RecoverUsernameForm setView={handleSetView} onOtpRequest={handleOtpRequest} />}
                {view === 'recoverPassword' && <RecoverPasswordForm setView={handleSetView} onValidateUser={handleValidateUser}/>}
                {view === 'corporateEnroll' && <CorporateEnrollForm setView={handleSetView} />}
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
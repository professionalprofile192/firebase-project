import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Landmark } from 'lucide-react';

export default function LoginPage() {
  const brandingImage = PlaceHolderImages.find((p) => p.id === 'login-branding');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E6E6FA] to-[#F4E2FF] lg:grid lg:grid-cols-2">
      <div className="relative hidden items-center justify-center lg:flex">
        <div className="absolute inset-0">
          {brandingImage && (
            <Image
              src={brandingImage.imageUrl}
              alt={brandingImage.description}
              fill
              className="object-cover"
              data-ai-hint={brandingImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-md space-y-8 text-white">
          <div className="flex items-center gap-4">
            <Landmark className="h-12 w-12" />
            <h1 className="text-4xl font-bold tracking-tighter">
              UBL Digital Banking
            </h1>
          </div>
          <blockquote className="border-l-4 border-primary pl-4">
            <p className="text-xl italic leading-relaxed">
              &ldquo;Secure, Swift, and Simple. Your financial world,
              reimagined. Welcome to the future of banking with UBL.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center bg-card p-6 sm:p-8 lg:min-h-0">
        <LoginForm />
      </div>
    </div>
  );
}

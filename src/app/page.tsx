import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  const ublLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8zN0b6+vrg4ODx8fEuMkJxdIEvM0LU1NX19fXAwMLn5+f7+/stMEFha36np6g3OUZPVWVJTl7R0dJLT147PUhSVmNBTlvo6OksL0EAAADu7u5wcHCVlpqgoaN+gYRrbHhWWHBfaX2WmZy5urw8jHukAAAEsklEQVR4nO2diVbyQBBGk6sKICAKKrgqiD5Q5P3f3XDhVdPNtBfTdt5Tz8x83ZuSNK3NAoFAIBAIBAKBQCAQCAQCgUAgEAgEAsG/odm++Y8IQuj9i8h00iGk8sDItNDfX/rRerYt4ZDu4M3VlX60L8pSDmk+fKq99KPpDmm83xT2o/UjL1E6/zR/S8A/Sj8Sp/uMy40wQy2/oF//UX8F+0f6y+j6BAwz/uJ/Av+B/q1vjU3wzP/sX0P/3v68vjW3wTM/eL4c/kP9bZ42N8Az/zR/X/4T/WOeNjfDM/86f1T+C/3rnjY3wzP/Un8A/35/W+eNjfDM/03/hP6b/WOeNjfDs/0n/1P9If7LnjY3wzL9E/2L/hv48z5ob4Zl/jf7Z/q39p3na3AjP/Gv0z/Zv7T/N0+ZGeOZbov+V/b/0p3lq3AjP/G3079k/3J/neXMjPHPkR2C3gX/M96e57pZ2s4L5U9i/8z19bopj4tgu/b/s3/p+u4/N2EzbNbP/aP+gP8xT5/iN2bTNPm+f/sH+q+d/S3/32t0/4P8e/s3+v/5X9o506N6HbrvjM/xP6z/bOfGrfDMMx/7n9f/yP5Qz52T4Zkf+F/av7W/oO+ds+ZcDMx/7H9z/1L/lXNuXAzMfuB/l/8q/s7+wL41VwIzb7g/hP9S/9h+wL82l8Izb7g/uP8c/t39EfnanAjNvud/Xf4h/W+eNrfCM2+5n8z/n39p59ob4Zk/u/84/xT+m541V8Iz/wf6r+x/w7+mc/pWeOZb8n/lf239G952rwIzP/k/tf8bfb3eereCMz88P6T/UP6zzxbvggm/qD/Tf9x/j+c79g3wjP/V/bf1n/mefGScCMx+YP89/WP+3zxTzIjMPmR/bP9t/eOeFdfCM/9w/xn9o/1bntLXwjM/OD+M/pX9K55S18Izn3vI/tn+h+f0tfCM3x6n8+D7D549T18Pz/6h/mX+3/0PnuLXwvP/8P2z/W+e45fC8//I/pH+Pz3Hr4Tnv+d/UP89z+FXwtP/3f0P+0/zHL4Snn8f/eP8r/SfcYlfCU//h+y/qv/Z5/FL4flf2H/Z/+nz+CVw/N/av7f/S//bZ/HLYPmr+5/sP+M89i+D5a/qH+F/qv+947F8Gy1/T/6X/S//pZ/HLoPnt4/03+1+eoy+D5/9w/h/9C/77nsUsg+a/r/+9/S/+/x7ELAflr8z85f1n/i89il0Hyl/f/7v/T//p57E4IzH6o/4z+L/5jntnWhMy/qH+a/sX+fM9sK0JmP2z/Vv9A/xWe29aEzL+y/9H+Yf1vnsOWhMx+sv/Q/oH+Vf5/ns2WhMz+ZP+L/Wv+Z55fl4TMc/+9/Tf+z/NeXRLyr65/vH+d/xf9I/65l5eEfA3/Uft3+q/o3/S6e2/1x/k//0/5R73+XhLyr/Vf7B/lH/Gv9/L2E/n/Y//S/sH+r98fIeP+Z/0P+8f9s94+EaC//n+gf7L/m+fHh3j65/vX/W/p/9g3x0f4+s/3v9L/6fN4fCSP4L/xP+P+l87jl/z1P/rP6x/7z/zDL7kF4GBAIBAIBAIBAIBAIBAKx/AZa3oX79+I03wAAAABJRU5ErkJggg==';
  return (
    <>
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        <div className="relative hidden items-center justify-center lg:flex">
          <div className="relative z-10 mx-auto max-w-md space-y-8 text-black">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-white p-2 shadow-md">
                <Image
                  src={ublLogo}
                  alt="UBL Digital Logo"
                  width={40}
                  height={40}
                  data-ai-hint="logo banking"
                  className="rounded-md"
                  priority
                />
              </div>
              <span className="text-2xl font-bold">UBL Digital</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight">
                Welcome to UBL Digital Business Banking
              </h1>
              <p className="text-lg text-gray-800">
                UBL Digital Business Banking offers a comprehensive suite of
                flexible online financial solutions to cater to all your business
                banking needs.
              </p>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center bg-transparent p-6 sm:p-8 lg:min-h-0">
          <LoginForm />
        </div>
      </div>
    </>
  );
}

"use client";

import Image from "next/image";
import { authClient } from "@/app/_lib/auth-client";
import { AuthGuard } from "@/app/_components/auth-guard";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M14.537 6.691H14V6.667H8V9.333H11.768C11.218 10.886 9.741 12 8 12C5.791 12 4 10.209 4 8C4 5.791 5.791 4 8 4C9.018 4 9.94 4.385 10.645 5.012L12.524 3.133C11.401 2.084 9.779 1.333 8 1.333C4.318 1.333 1.333 4.318 1.333 8C1.333 11.682 4.318 14.667 8 14.667C11.682 14.667 14.667 11.682 14.667 8C14.667 7.554 14.621 7.118 14.537 6.691Z"
        fill="#FFC107"
      />
      <path
        d="M2.102 4.89L4.292 6.507C4.885 5.036 6.32 4 8 4C9.018 4 9.94 4.385 10.645 5.012L12.524 3.133C11.401 2.084 9.779 1.333 8 1.333C5.436 1.333 3.218 2.776 2.102 4.89Z"
        fill="#FF3D00"
      />
      <path
        d="M8 14.667C9.742 14.667 11.332 13.947 12.444 12.832L10.392 11.082C9.706 11.597 8.868 11.901 8 11.901C6.267 11.901 4.795 10.797 4.24 9.254L2.065 10.94C3.168 13.118 5.405 14.667 8 14.667Z"
        fill="#4CAF50"
      />
      <path
        d="M14.537 6.691H14V6.667H8V9.333H11.768C11.504 10.074 11.032 10.717 10.391 11.083L10.392 11.082L12.444 12.832C12.292 12.97 14.667 11.167 14.667 8C14.667 7.554 14.621 7.118 14.537 6.691Z"
        fill="#1976D2"
      />
    </svg>
  );
}

export default function AuthPage() {
  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    });

    if (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <AuthGuard mode="guest">
    <div className="relative flex min-h-dvh flex-col bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/login-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex justify-center pt-12">
        <Image
          src="/fit-ai-logo.svg"
          alt="FIT.AI"
          width={85}
          height={38}
          priority
        />
      </div>

      <div className="relative z-10 mt-auto flex flex-col items-center gap-15 rounded-t-[20px] bg-[#2b54ff] px-5 pb-10 pt-12">
        <div className="flex flex-col items-center gap-6">
          <h1 className="font-display text-[32px] font-semibold leading-[1.05] text-center text-white">
            O app que vai transformar a forma como você treina.
          </h1>

          <button
            onClick={handleGoogleSignIn}
            className="flex h-[38px] cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 transition-opacity hover:opacity-90"
          >
            <GoogleIcon />
            <span className="text-sm font-semibold text-black">
              Fazer login com Google
            </span>
          </button>
        </div>

        <p className="text-xs text-white/70">
          ©2026 Copyright FIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
    </AuthGuard>
  );
}

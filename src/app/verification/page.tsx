'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VerificationPage() {
  const [code, setCode] = useState(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Pré-remplit les références pour les inputs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 5);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Passer à l'input suivant si on a entré un caractère
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Revenir à l'input précédent si on supprime un caractère
    if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Vérifier que le code est complet
    if (code.every((c) => c !== '')) {
      window.location.href = '/clients';
    }
  };

  const handleResendCode = () => {
    // Simuler l'envoi d'un nouveau code
    alert('Un nouveau code a été envoyé');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-10">
        <Logo />
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Confirmation</h2>
        <p className="mb-6">Entrer le code de vérification envoyé par mail.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="w-12 h-12 text-center text-lg"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
            Vérifier
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={handleResendCode}
            className="text-brand-blue hover:text-brand-blue/80"
          >
            Renvoyer le code
          </Button>
        </div>
      </div>
    </div>
  );
}

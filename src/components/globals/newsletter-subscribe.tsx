'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ChevronRightIcon, LoaderIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';

const emailSchema = z.object({
  email: z.string().email({ message: 'Use um email válido' }),
});

export const AnimatedSubscribeButton = () => {
  const [buttonState, setButtonState] = useState<keyof typeof buttonCopy>('idle');
  const supabase = createClient();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    mutation.mutate({ email: values.email });
  }

  const mutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await supabase.from('newsletter_subscriptions').insert({ email });

      // Error "23505" means that the user is already subscribed, on that case, trigger `onSuccess`
      if (error && error.code !== '23505') {
        throw new Error('Não foi possível inscrever email');
      }

      return true;
    },
    onMutate: () => {
      setButtonState('loading');
    },
    onSuccess: () => {
      setButtonState('subscribed');

      setTimeout(() => {
        setButtonState('idle');
        form.reset();
      }, 4000);
    },
    onError: () => {
      setButtonState('error');

      setTimeout(() => {
        setButtonState('idle');
        form.reset();
      }, 4000);
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <Input
        className="text-white"
        type="email"
        placeholder="Seu email"
        {...form.register('email')}
      />
      <Button
        variant="outline"
        className="w-48 relative disabled:opacity-100"
        disabled={buttonState !== 'idle'}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={buttonState}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            className={buttonCopy[buttonState]['className']}
          >
            {buttonCopy[buttonState]['content']}
          </motion.span>
        </AnimatePresence>
      </Button>
    </form>
  );
};

const buttonCopy = {
  idle: {
    className: 'group inline-flex items-center',
    content: (
      <>
        Inscrever-se{' '}
        <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </>
    ),
  },
  loading: {
    className: '',
    content: <LoaderIcon className="animate-spin" />,
  },
  subscribed: {
    className: 'group inline-flex items-center',
    content: (
      <>
        <CheckIcon className="mr-2 h-4 w-4" />
        Inscrito
      </>
    ),
  },
  error: {
    className: 'text-red-500',
    content: <>Algo deu errado 😞</>,
  },
};

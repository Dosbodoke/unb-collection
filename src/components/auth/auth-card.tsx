"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

import { EyeIcon, EyeOffIcon, Loader2, TriangleAlertIcon } from "lucide-react";
import { GoogleIcon } from "@/assets";

import { loginUser, signup } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, MotionInput } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MotionAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const MotionButton = motion(Button);

const passwordSchema = z.string().min(8).max(100);
const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

const signupSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: "custom",
        message: "Senhas devem ser iguais",
        path: ["confirmPassword"],
      });
    }
  });

const OrWithGoogle = () => {
  const supabase = createClient();

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?redirect_to=${location.href}`,
      },
    });
  }

  return (
    <>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
            OU
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={loginWithGoogle}
        className="flex gap-2 w-full"
      >
        <div className="h-6 w-6">
          <GoogleIcon />
        </div>
        <span>Continuar com Google</span>
      </Button>
    </>
  );
};

const TogglePasswordVisibility = ({
  passwordVisible,
  setPasswordVisible,
  layoutId,
}: {
  passwordVisible: boolean;
  setPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
  layoutId?: string;
}) => {
  return (
    <MotionButton
      layoutId={layoutId}
      variant="outline"
      size="icon"
      type="button"
      onClick={() => setPasswordVisible((prev) => !prev)}
    >
      {passwordVisible ? (
        <>
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">Ver senha</span>
        </>
      ) : (
        <>
          <EyeOffIcon className="h-4 w-4" />
          <span className="sr-only">Ver senha</span>
        </>
      )}
    </MotionButton>
  );
};

const LoginCard = ({
  onSuccess,
  setMode,
}: {
  onSuccess?: () => void;
  setMode: React.Dispatch<React.SetStateAction<"login" | "signup">>;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const res = await loginUser(values);

    if (res.success) {
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    }

    if (res.reason) {
      form.setError("root.reason", { message: res.reason });
    }
  }

  const rootError = form.formState.errors.root?.reason?.message;

  return (
    <motion.div className="w-full">
      <div className="flex gap-2 flex-col items-center">
        <motion.h1 layoutId="card-header" className="text-3xl font-bold">
          Entrar na conta
        </motion.h1>
      </div>

      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MotionInput
                    layoutId="auth-email"
                    type="email"
                    placeholder="Email"
                    {...field}
                    className="h-10"
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
                <FormControl>
                  <div className="flex justify-between gap-2">
                    <MotionInput
                      layoutId="auth-password"
                      placeholder="Sua senha"
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                      className="h-auto"
                    />
                    <TogglePasswordVisibility
                      layoutId="auth-password-visibility-toggle"
                      passwordVisible={passwordVisible}
                      setPasswordVisible={setPasswordVisible}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {rootError && (
            <p className="text-center text-[0.8rem] font-medium text-destructive animate-in duration-200 slide-in-from-bottom-1 fade-in">
              {rootError}
            </p>
          )}
          <MotionButton
            layoutId="auth-submit"
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              (!form.formState.isValid && form.formState.isDirty)
            }
            className="w-full flex gap-2 items-center"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Entrando....</span>
              </>
            ) : (
              <motion.span layoutId="auth-submit-text">Entrar</motion.span>
            )}
          </MotionButton>
          <motion.div layoutId="auth-change" className="text-center text-sm">
            Não tem uma conta?{" "}
            <Button
              type="button"
              onClick={() => setMode("signup")}
              variant="link"
              className="p-0"
            >
              Inscrever-se
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export const SignupCard = ({
  setMode,
}: {
  setMode: React.Dispatch<React.SetStateAction<"login" | "signup">>;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    const res = await signup(values);

    if (res.success) {
      form.reset();
      setMode("login");
    }

    if (res.reason) {
      form.setError("root.reason", { message: res.reason });
      form.setError("email", { message: "" });
    }
  }

  const rootError = form.formState.errors.root?.reason?.message;

  return (
    <motion.div className="w-full">
      <div className="flex gap-2 flex-col items-center">
        <motion.h1 layoutId="card-header" className="text-3xl font-bold">
          Inscrever-se
        </motion.h1>
      </div>

      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MotionInput
                    layoutId="auth-email"
                    type="email"
                    placeholder="Email"
                    {...field}
                    className="h-10"
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
                <FormControl>
                  <div className="flex justify-between gap-2 group">
                    <MotionInput
                      layoutId="auth-password"
                      placeholder="Sua senha"
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                      className="h-auto group-aria-[invalid=true]:border-red-500"
                    />
                    <TogglePasswordVisibility
                      layoutId="auth-password-visibility-toggle"
                      passwordVisible={passwordVisible}
                      setPasswordVisible={setPasswordVisible}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex justify-between gap-2 group">
                    <MotionInput
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5 },
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        transition: { duration: 0.2 },
                      }}
                      placeholder="Confirmar senha"
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                      className="h-auto group-aria-[invalid=true]:border-red-500"
                    />
                    <TogglePasswordVisibility
                      passwordVisible={passwordVisible}
                      setPasswordVisible={setPasswordVisible}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {rootError && (
            <MotionAlert
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 1, type: "spring" }}
              variant="destructive"
              className="flex items-start gap-2"
            >
              <div>
                <TriangleAlertIcon className="size-4" />
              </div>
              <div>
                <AlertTitle>{rootError}</AlertTitle>
                <AlertDescription>
                  Se você se registrou usando o Google, tente fazer login
                  diretamente com sua conta Google. Caso contrário, utilize
                  outro e-mail ou recupere sua senha se esqueceu.
                </AlertDescription>
              </div>
            </MotionAlert>
          )}
          <MotionButton
            layoutId="auth-submit"
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              (!form.formState.isValid && form.formState.isDirty)
            }
            className="w-full flex gap-2 items-center"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Criando sua conta....</span>
              </>
            ) : (
              <motion.span layoutId="auth-submit-text">Criar</motion.span>
            )}
          </MotionButton>
          <motion.div layoutId="auth-change" className="text-center text-sm">
            Já tem uma conta?{" "}
            <Button
              type="button"
              onClick={() => setMode("login")}
              variant="link"
              className="p-0"
            >
              Entrar
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

const AuthCard = ({ onLogin }: { onLogin?: () => void }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <motion.div
      layout
      className="flex flex-col items-center w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {mode === "login" ? (
          <LoginCard
            key="auth-card-login"
            setMode={setMode}
            onSuccess={onLogin}
          />
        ) : (
          <SignupCard key="auth-card-signup" setMode={setMode} />
        )}
      </AnimatePresence>
      <OrWithGoogle />
    </motion.div>
  );
};

export { AuthCard };

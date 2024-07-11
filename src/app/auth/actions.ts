'use server'

import { revalidatePath } from 'next/cache';

import { createClient } from '@/utils/supabase/server';

export const loginUser = async ({ email, password} : { email: string; password: string}) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (data.user) {
    revalidatePath('/', 'layout');
    return { success: true };
  }
  
  let reason = null
  if (error?.message === "Invalid login credentials") {
    reason = "Credenciais inválidas"
  }

  return { success: false, reason };
};

export const signup = async ({ email, password} : { email: string; password: string}) => {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (data.user) {
    return { success: true };
  }

  let reason = null
  if (error?.code === "user_already_exists") {
    reason = "Email já está em uso"
  }

  return { success: false, reason };
};

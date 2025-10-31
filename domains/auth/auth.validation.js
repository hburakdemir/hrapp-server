import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
    surname: z.string().min(2, 'Soyisim en az 2 karakter olmalı'),
    email: z.string().email('Geçerli bir email giriniz'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});

export const loginSchema = z.object({
    email: z.string().email('Geçerli bir email giriniz'),
    password: z.string().min(1, 'Şifre zorunludur'),
});
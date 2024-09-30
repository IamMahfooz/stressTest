"use client"

import {z} from "zod"
import {useRouter} from "next/navigation"
import {auth} from "../custom/firebase-auth"
import {createUserWithEmailAndPassword} from "firebase/auth";
import {signupUser} from '@/app/components/custom/firebase-utils';


const signupFormSchema = z.object({
    email: z.string().email({message: 'Email is required'}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    confirmPassword: z.string().min(8, {message: "Password Didn't match"}),
}).superRefine(({confirmPassword, password}, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ['confirmPassword']
        });
    }
});

export default function SignupProfileForm(form: any) {
    const router = useRouter();
    return function onSubmit(values: z.infer<typeof signupFormSchema>) {
        // user signup
        signupUser(values.email, values.password)
        router.push(`/`)
    }
}


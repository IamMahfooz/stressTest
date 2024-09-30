"use client"

import {z} from "zod"
import {useRouter} from "next/navigation"
import {loginUser} from '@/app/components/custom/firebase-utils';


const loginFormSchema = z.object({
    email: z.string().email({message: 'Email is required'}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
})

export default function LoginProfileForm(form: any) {
    const router = useRouter();
    return function onSubmit(values: z.infer<typeof loginFormSchema>) {
        // user sign in
        loginUser(values.email, values.password)
        router.push(`/`)
    }
}

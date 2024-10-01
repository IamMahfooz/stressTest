"use client"

import {z} from "zod"
import {useRouter} from "next/navigation"

const formSchema = z.object({
    problemUrl: z.string().min(50, {
        message: "problems url must be least 50 char long",
    }),
})

export default function CodeForm(form: any) {
    const router = useRouter();
    return function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log("form value was : ",values.problemUrl)
        router.push('/problems?suburl=' + values.problemUrl)
    }
}

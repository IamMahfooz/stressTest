"use client"

import {z} from "zod"
import {useRouter} from "next/navigation"

const ContestformSchema = z.object({
    isFirstLineT: z.boolean().default(false),
    inputLines: z.number().min(1,{
        message: 'Minimum Input Lines should be 1',
    }),
    outputLines: z.number().min(1,{
        message: 'Minimum output Lines should be 1',
    })
})

export default function CodeForm(form: any) {
    const router = useRouter();
    return function onSubmit(values: z.infer<typeof ContestformSchema>) {
        // console.log("form value was : ",values.problemUrl)
        router.push('/problems?suburl=' + values.isFirstLineT)
    }
}

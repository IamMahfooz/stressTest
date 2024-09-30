"use client"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useForm} from "react-hook-form"
import ProfileForm from "@/app/components/custom/form"
import {zodResolver} from "@hookform/resolvers/zod"

const formSchema = z.object({
    problemId: z.string().min(1, {
        message: "Problem ID must be at least 1 characters.",
    }),
})

export default function ProblemForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            problemId: "123",
        },
    })
    let onSubmit = ProfileForm(form)

    return (
        <>
            <title>PB - Form Page</title>
            <div className="flex items-center justify-center min-h-screen ">
                <div
                    className="relative pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
                    <div className="flex space-x-3 px-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="problemId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Problem ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is the problem ID of your leetcode question.
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

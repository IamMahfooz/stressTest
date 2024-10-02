"use client";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import ProfileForm from "@/app/components/custom/form";
import {zodResolver} from "@hookform/resolvers/zod";
import CodeForm from '@/app/components/custom/form';

const formSchema = z.object({
    problemUrl: z.string().min(46, {
        message: "Problem ID must be at least 1 character.",
    }),
});

export default function ProblemForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            problemUrl: "https://atcoder.jp/contests/arc171/submissions/57212748",
        },
    });
    let onSubmit = CodeForm(form);

    return (
        <>
            <title>AST - Form Page</title>
            <div className="max-w-2xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-center text-gray-800 dark:text-gray-200 text-2xl mb-4 font-bold">
                    Stress Test Your Atcoder Problems
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-center">
                    Have you ever been stuck on a problem for hours? It’s a common scenario for beginners and intermediates—and
                    even experts experience it from time to time! Overcoming these challenges is key to improving, and the right
                    hints can help guide you in the right direction.
                    <br />
                    <br />
                    Imagine if you could instantly receive the failing test case for your current submission. Wouldn’t that save
                    time and point you toward the correct solution?
                    <br />
                    <br />
                    Now, that’s possible! Simply enter your query, and you’re good to go. <strong>Your path to efficiency starts
                    here.</strong>
                </p>

                <div className="flex justify-center">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                            <FormField
                                control={form.control}
                                name="problemUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-800 dark:text-gray-200 text-sm">Submission Link (only submission to ARC171-A supported for demo purpose)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://atcoder.jp/contests/arc171/submissions/57212748"
                                                {...field}
                                                className="border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm w-full dark:bg-gray-700 dark:text-gray-200"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                                            Enter your Atcoder submission link
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <button
                                type="submit"
                                className="w-full mt-6 p-3 bg-green-600 hover:bg-green-700 text-white text-lg rounded-md"
                            >
                                Submit
                            </button>
                        </form>
                    </Form>
                </div>
            </div>
        </>

    );
}

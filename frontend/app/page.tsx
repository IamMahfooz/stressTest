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
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
                <h1 style={{
                    textAlign: "center",
                    color: "#333",
                    fontSize: '24px',
                    marginBottom: '16px'
                }}>
                    Stress Test Your Atcoder Problems
                </h1>

                <p style={{
                    fontSize: '16px',
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    textAlign: 'center'
                }}>
                    Have you ever been stuck on a problem for hours? It’s a common scenario for beginners and
                    intermediates—and even experts experience it from time to time! Overcoming these challenges is key
                    to improving, and the right hints can help guide you in the right direction. <br/><br/>

                    Imagine if you could instantly receive the failing test case for your current submission. Wouldn’t
                    that save time and point you toward the correct solution? <br/><br/>

                    Now, that’s possible! Simply enter your query, and you’re good to go. <strong>Your path to
                    efficiency starts here.</strong>
                </p>

                <div className="form-container" style={{display: "flex", justifyContent: "center"}}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} style={{width: "100%"}}>
                            <FormField
                                control={form.control}
                                name="problemUrl"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel style={{color: "#333", fontSize: "14px"}}>Submission Link</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://atcoder.jp/contests/arc171/submissions/57212748"
                                                {...field}
                                                style={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    padding: '10px',
                                                    fontSize: '14px',
                                                    width: '100%'
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription style={{color: "#666", fontSize: "12px", marginTop: '8px'}}>
                                            Enter your Atcoder submission link
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" style={{
                                marginTop: '20px',
                                padding: '10px 0',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                fontSize: '16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                border: 'none'
                            }}>
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

        </>
    );
}

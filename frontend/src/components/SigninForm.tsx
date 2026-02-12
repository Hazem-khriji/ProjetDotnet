﻿import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { authService } from "@/lib/api"

export default function SigninForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        try {
            const data = await authService.login(formData);

            if (data.success) {
                console.log('Login successful:', data.user);
                // Redirect based on user role
                if (data.user?.roles?.includes('Admin')) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setErrors(data.errors || [data.message]);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors(['An error occurred during login. Please try again.']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            {errors.length > 0 && (
                                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
                                    {errors.map((error, index) => (
                                        <p key={index} className="text-sm">{error}</p>
                                    ))}
                                </div>
                            )}
                            
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input 
                                    id="password" 
                                    name="password"
                                    type="password" 
                                    value={formData.password}
                                    onChange={handleChange}
                                    required 
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="rounded border-gray-300"
                                    />
                                    <label htmlFor="rememberMe" className="text-sm">
                                        Remember me
                                    </label>
                                </div>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                                {/*<Button variant="outline" type="button">*/}
                                {/*    Login with Google*/}
                                {/*</Button>*/}
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

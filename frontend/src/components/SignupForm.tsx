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
import { useAuthStore } from "@/stores/authStore"

export default function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
    const navigate = useNavigate();
    const { register, isLoading } = useAuthStore();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        const result = await register(formData);

        if (result.success) {
            console.log('Registration successful');
            navigate('/properties');
        } else {
            setErrors(result.errors || [result.message || 'Registration failed']);
        }
    };

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
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
                            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Field>
                        
                        <Field>
                            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </Field>

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
                            <FieldLabel htmlFor="phoneNumber">Phone Number (Optional)</FieldLabel>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder="+1234567890"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input 
                                id="password" 
                                name="password"
                                type="password" 
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                            <FieldDescription>
                                Must be at least 6 characters long.
                            </FieldDescription>
                        </Field>
                        
                        <Field>
                            <FieldLabel htmlFor="confirmPassword">
                                Confirm Password
                            </FieldLabel>
                            <Input 
                                id="confirmPassword" 
                                name="confirmPassword"
                                type="password" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required 
                            />
                            <FieldDescription>Please confirm your password.</FieldDescription>
                        </Field>
                        
                        <FieldGroup>
                            <Field>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account? <Link to="/signin">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

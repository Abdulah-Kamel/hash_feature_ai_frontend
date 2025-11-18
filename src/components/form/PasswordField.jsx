"use client"
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = ({ control, name, label, placeholder, autoComplete }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                    <div className="relative">
                        <Input
                            {...field}
                            id={field.name}
                            type={showPassword ? 'text' : 'password'}
                            placeholder={placeholder}
                            className="h-10 sm:h-12 bg-card text-white placeholder:text-white"
                            aria-invalid={fieldState.invalid}
                            autoComplete={autoComplete}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 left-0 cursor-pointer flex items-center px-3 text-gray-500"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
                        </button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};

export default PasswordField;
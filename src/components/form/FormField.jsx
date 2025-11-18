"use client"
import React from 'react';
import { Controller } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

const FormField = ({ control, name, label, type = "text", placeholder, autoComplete, className }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        type={type}
                        placeholder={placeholder}
                        className={cn("h-10 sm:h-12", className)}
                        aria-invalid={fieldState.invalid}
                        autoComplete={autoComplete}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};

export default FormField;
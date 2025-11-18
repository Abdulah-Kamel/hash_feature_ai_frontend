"use client"
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import 'react-phone-number-input/style.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const CustomPhoneInput = React.forwardRef(({ className, placeholder, ...props }, ref) => (
    <div className="relative flex-1">
        <Input
            name="phone"
            {...props}
            ref={ref}
            placeholder=""
            className="h-10 sm:h-12 rounded-r-none flex-1 border-r-0 text-right"
            style={{direction: "ltr"}}
        />
        {/* Custom RTL placeholder */}
        {!props.value && (
            <div
                className="absolute inset-0 flex items-center justify-end px-3 pointer-events-none text-muted-foreground"
                style={{direction: "ltr"}}
            >
                {placeholder}
            </div>
        )}
    </div>
));
CustomPhoneInput.displayName = "CustomPhoneInput";

const PhoneField = ({ control, name, label, placeholder,PhoneInput,getCountryCallingCode,value,setValue }) => {

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                    <div className="flex">
                        <PhoneInput
                            {...field}
                            id={field.name}
                            international={false}
                            countryCallingCodeEditable={false}
                            defaultCountry="SA"
                            value={value}
                            onChange={(phoneValue) => {
                                setValue(phoneValue);
                                field.onChange(phoneValue);
                            }}
                            placeholder={placeholder}
                            className="flex w-full"
                            inputComponent={CustomPhoneInput}
                            withCountryCallingCode={false}
                            displayInitialValueAsLocalNumber={true}
                            aria-invalid={fieldState.invalid}
                            countrySelectComponent={({ value, onChange, options, ...rest }) => (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 h-10 sm:h-12 px-3 rounded-l-none border-l hover:bg-gray-100 min-w-[80px]"
                                            type="button"
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                            <span className="text-sm">
                                                {value ? `+${getCountryCallingCode(value)}` : '+966'}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-56">
                                        <DropdownMenuItem onClick={() => onChange('SA')}>
                                            <span className="flex items-center gap-2">
                                                🇸🇦 +966 السعودية
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onChange('AE')}>
                                            <span className="flex items-center gap-2">
                                                🇦🇪 +971 الإمارات
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onChange('KW')}>
                                            <span className="flex items-center gap-2">
                                                🇰🇼 +965 الكويت
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onChange('QA')}>
                                            <span className="flex items-center gap-2">
                                                🇶🇦 +974 قطر
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onChange('BH')}>
                                            <span className="flex items-center gap-2">
                                                🇧🇭 +973 البحرين
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onChange('OM')}>
                                            <span className="flex items-center gap-2">
                                                🇴🇲 +968 عمان
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onChange('JO')}>
                                            <span className="flex items-center gap-2">
                                                🇯🇴 +962 الأردن
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onChange('LB')}>
                                            <span className="flex items-center gap-2">
                                                🇱🇧 +961 لبنان
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onChange('EG')}>
                                            <span className="flex items-center gap-2">
                                                🇪🇬 +20 مصر
                                            </span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};

export default PhoneField;
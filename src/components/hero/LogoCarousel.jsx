import React from 'react';
import Image from 'next/image';
import { partnersData } from '@/data/partnersData';

const LogoCarousel = () => {
    return (
        <div className="bg-background py-4">
            <div className="mx-auto px-6 lg:px-8">
                <div className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
                    {partnersData.map((logo) => (
                        <Image
                            key={logo.id}
                            className="col-span-1 max-h-12 w-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                            src={logo.src}
                            alt={logo.alt}
                            width={158}
                            height={48}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoCarousel;
"use client"

import React from 'react';
import Image from 'next/image';

export interface AvatarLibProps {
    src?: string;
    name: string;
    size?: 'small' | 'medium' | 'large' | 'picture';
    alt?: string;
    className?: string;
}

export const AvatarLib: React.FC<AvatarLibProps> = ({
                                                        src,
                                                        name,
                                                        size = 'medium',
                                                        alt,
                                                        className = '',
                                                    }) => {
    const getInitials = (fullName: string): string => {
        const names = fullName.trim().split(' ');
        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };

    const [imageError, setImageError] = React.useState(false);
    const initials = getInitials(name);
    const showInitials = !src || imageError;

    const sizeMap = {
        small: { width: 32, height: 32 },
        medium: { width: 48, height: 48 },
        large: { width: 64, height: 64 },
        picture: { width: 160, height: 200 },
    };

    const isSvg = src?.endsWith('.svg');

    return (
        <div className={`avatar-lib avatar-lib--${size} ${className}`}>
            {showInitials ? (
                <div className="avatar-lib__initials">
                    {initials}
                </div>
            ) : isSvg ? (
                //svg
                <img
                    src={src}
                    alt={alt || name}
                    className="avatar-lib__image"
                    onError={() => setImageError(true)}
                />
            ) : (
                <Image
                    src={src!}
                    alt={alt || name}
                    width={sizeMap[size].width}
                    height={sizeMap[size].height}
                    className="avatar-lib__image"
                    onError={() => setImageError(true)}
                />
            )}
        </div>
    );
};
import { getContrastTextColor } from '@/helpers/colors';
import { Team } from '@/types/Team';
import React from 'react';

const darkenColor = (hex: string, percent: number) => {
    const num = parseInt(hex, 16);
    let r = (num >> 16) + percent;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + percent;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + percent;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

export default function TeamHeader({ team, onClick }: { team: Team; onClick: () => void; }) {
    const darkerColor = darkenColor(team.color, -40);
    const textColor = getContrastTextColor(team.color);
    const emojiBackground = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ctext y='32' font-size='32'%3E${team.emoji}%3C/text%3E%3C/svg%3E")`;
    const textShadow = textColor === 'black' ? '1px 1px 8px rgba(255,255,255,0.6)' : '1px 1px 8px rgba(0,0,0,0.6)';

    return (
        <div onClick={onClick} className="max-w-2xl relative w-full h-24 px-6 py-4 rounded-2xl shadow-xl overflow-hidden mb-4 flex items-center select-none cursor-pointer hover:scale-105 transition-transform duration-300" 
            style={{ color: textColor, background: `linear-gradient(135deg, #${team.color}, #${darkerColor})`}}
        >
            <div className="absolute inset-0 opacity-[0.07] bg-repeat" style={{ backgroundImage: emojiBackground, backgroundSize: '60px' }}/>
            <div className="relative z-10 flex items-center justify-between w-full">
                <div className="text-6xl" style={{ textShadow }}>
                    {team.emoji}
                </div>

                <div className="flex flex-col items-center text-center">
                    <span className="text-2xl font-bold tracking-wide leading-tight" style={{ textShadow }}>
                        {team.name}
                    </span>
                    <span className="text-md font-semibold tracking-wide leading-tight italic opacity-80" style={{ textShadow }}>
                        "{team.motto}"
                    </span>
                </div>
                <div className="w-16 h-16" />
            </div>
        </div>
    );
}

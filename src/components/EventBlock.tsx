import { getContrastTextColor } from "@/helpers/colors";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

type EventBlockProps = {
    title: string;
    emoji: string;
    inning?: number;
    inning_side?: number;
    messages: string[];
    color: string;
}

export default function EventBlock({ title, emoji, inning, inning_side, messages, color }: EventBlockProps) {
    const titleTextColor = getContrastTextColor(color);
    const titleBackgroundColor = `rgba(${hexToRgb(color)?.r}, ${hexToRgb(color)?.g}, ${hexToRgb(color)?.b}, 0.8)`;

    return (
        <div className="relative mt-6 w-full">
            {(emoji || title) && (
                <div 
                  className={`absolute -top-3 left-3 z-10 border-white/10 inline-block rounded-full px-3 py-1 text-base font-bold text-theme-secondary border border-theme-accent shadow-md`}
                  style={{background: titleBackgroundColor, color: titleTextColor}}
                >
                    {emoji && <span className="mr-1">{emoji}</span>} {title}
                </div>
            )}
            {inning && 
                <div className={`absolute -top-3 right-3 z-10 border-white/10 inline-block rounded-full px-3 py-1 text-base font-bold text-theme-secondary border border-theme-accent shadow-md`} style={{background: titleBackgroundColor, color: titleTextColor}}>
                    {inning_side === 0 ? '▲' : '▼'} {inning}
                </div>
            }
            <div className="bg-[#364156]/50 backdrop-blur-lg border rounded-2xl shadow-2xl p-4 transition-colors rounded-md pt-6 p-3 mt-4" style={{ borderColor: `#${color}` }}>        
                <div className="text-sm whitespace-pre-line space-y-1">
                    {messages.toReversed().map((message, i) => (
                        <div key={i} className="flex-1 text-left leading-[1.3] [&>*]:inline [&>*]:whitespace-normal" dangerouslySetInnerHTML={{__html: message}} />
                    ))}
                </div>
            </div>
        </div>
    );
}
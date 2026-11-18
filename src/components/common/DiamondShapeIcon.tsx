import type { DiamondShape } from '@/domain/types';

export const DIAMOND_SHAPES: { value: DiamondShape; label: string }[] = [
  { value: 'Round', label: 'Yuvarlak' },
  { value: 'Oval', label: 'Oval' },
  { value: 'Cushion', label: 'Cushion' },
  { value: 'Emerald', label: 'Zümrüt' },
  { value: 'Radiant', label: 'Radiant' },
  { value: 'Pear', label: 'Damla' },
  { value: 'Princess', label: 'Prenses' },
  { value: 'Marquise', label: 'Markiz' },
  { value: 'Asscher', label: 'Asscher' },
  { value: 'Heart', label: 'Kalp' },
];

export function DiamondShapeIcon({
  shape,
  className = 'w-7 h-7',
}: {
  shape: DiamondShape;
  className?: string;
}) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };

  switch (shape) {
    case 'Round':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <polygon points="12,5 17,9 17,15 12,19 7,15 7,9" />
          <line x1="12" y1="3" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="21" />
        </svg>
      );
    case 'Oval':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="12" rx="6.5" ry="9.5" />
          <ellipse cx="12" cy="12" rx="3.5" ry="5.5" />
        </svg>
      );
    case 'Cushion':
      return (
        <svg {...props}>
          <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" />
          <rect x="7.5" y="7.5" width="9" height="9" rx="2.5" />
        </svg>
      );
    case 'Emerald':
      return (
        <svg {...props}>
          <polygon points="7,3 17,3 20,6 20,18 17,21 7,21 4,18 4,6" />
          <polygon points="9,6.5 15,6.5 17,8.5 17,15.5 15,17.5 9,17.5 7,15.5 7,8.5" />
        </svg>
      );
    case 'Radiant':
      return (
        <svg {...props}>
          <polygon points="7,3 17,3 20,6 20,18 17,21 7,21 4,18 4,6" />
          <line x1="7" y1="3" x2="17" y2="21" />
          <line x1="17" y1="3" x2="7" y2="21" />
        </svg>
      );
    case 'Pear':
      return (
        <svg {...props}>
          <path d="M12 3C12 3 18.5 10.5 18.5 15C18.5 18.6 15.6 21 12 21C8.4 21 5.5 18.6 5.5 15C5.5 10.5 12 3 12 3Z" />
          <path d="M12 7.5C12 7.5 15.5 12 15.5 15C15.5 16.9 13.9 18.2 12 18.2C10.1 18.2 8.5 16.9 8.5 15C8.5 12 12 7.5 12 7.5Z" />
        </svg>
      );
    case 'Princess':
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      );
    case 'Marquise':
      return (
        <svg {...props}>
          <path d="M12 2.5C16.5 7 18.5 10.5 18.5 12C18.5 13.5 16.5 17 12 21.5C7.5 17 5.5 13.5 5.5 12C5.5 10.5 7.5 7 12 2.5Z" />
          <path d="M12 6.5C14.5 9.2 15.5 11 15.5 12C15.5 13 14.5 14.8 12 17.5C9.5 14.8 8.5 13 8.5 12C8.5 11 9.5 9.2 12 6.5Z" />
        </svg>
      );
    case 'Asscher':
      return (
        <svg {...props}>
          <polygon points="8,3 16,3 21,8 21,16 16,21 8,21 3,16 3,8" />
          <rect x="7.5" y="7.5" width="9" height="9" />
          <line x1="3" y1="8" x2="7.5" y2="7.5" />
          <line x1="21" y1="8" x2="16.5" y2="7.5" />
        </svg>
      );
    case 'Heart':
      return (
        <svg {...props}>
          <path d="M12 20.5C12 20.5 4 14.8 4 9.2C4 6.5 6.1 4.5 8.6 4.5C10.2 4.5 11.4 5.3 12 6.5C12.6 5.3 13.8 4.5 15.4 4.5C17.9 4.5 20 6.5 20 9.2C20 14.8 12 20.5 12 20.5Z" />
        </svg>
      );
  }
}

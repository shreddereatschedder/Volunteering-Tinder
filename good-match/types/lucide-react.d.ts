declare module 'lucide-react' {
  import * as React from 'react';

  export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  export const ArrowLeft: React.FC<IconProps>;
  export const MapPin: React.FC<IconProps>;
  export const Clock: React.FC<IconProps>;
  export const User: React.FC<IconProps>;
  export const Mail: React.FC<IconProps>;
  export const CheckCircle2: React.FC<IconProps>;
  export const Heart: React.FC<IconProps>;
  export const RefreshCw: React.FC<IconProps>;
}

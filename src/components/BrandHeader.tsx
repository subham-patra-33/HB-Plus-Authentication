import { HBPlusLogo } from './HBPlusLogo';

type Props = {
  compact?: boolean;
};

export function BrandHeader({ compact = false }: Props) {
  return <HBPlusLogo size={compact ? 'sm' : 'md'} showSubtitle={!compact} />;
}

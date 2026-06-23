import { SurfaceYieldInput, SurfaceYieldResult } from '@/types/calculator';

export function calcSurfaceYield(input: SurfaceYieldInput): SurfaceYieldResult | null {
  const { propertyPrice, monthlyRent } = input;
  if (propertyPrice <= 0 || monthlyRent <= 0) return null;

  const annualRent = monthlyRent * 12;
  const surfaceYield = (annualRent / propertyPrice) * 100;
  const paybackYears = propertyPrice / annualRent;

  return { annualRent, surfaceYield, paybackYears };
}

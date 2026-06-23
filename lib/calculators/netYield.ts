import { NetYieldInput, NetYieldResult } from '@/types/calculator';

export function calcNetYield(input: NetYieldInput): NetYieldResult | null {
  const {
    propertyPrice,
    monthlyRent,
    purchaseCost,
    annualManagementFee,
    annualRepairFund,
    annualPropertyTax,
    annualInsurance,
    vacancyRate,
    otherExpenses,
  } = input;

  if (propertyPrice <= 0 || monthlyRent <= 0) return null;

  const annualRentFull = monthlyRent * 12;
  const annualRentWithVacancy = annualRentFull * (1 - vacancyRate / 100);
  const annualExpenses =
    annualManagementFee + annualRepairFund + annualPropertyTax + annualInsurance + otherExpenses;
  const annualNetIncome = annualRentWithVacancy - annualExpenses;
  const totalInvestment = propertyPrice + purchaseCost;
  const surfaceYield = (annualRentFull / propertyPrice) * 100;
  const netYield = totalInvestment > 0 ? (annualNetIncome / totalInvestment) * 100 : 0;
  const monthlyNetIncome = annualNetIncome / 12;

  return {
    annualRentWithVacancy,
    annualExpenses,
    annualNetIncome,
    totalInvestment,
    surfaceYield,
    netYield,
    monthlyNetIncome,
  };
}

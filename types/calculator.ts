export interface SurfaceYieldInput {
  propertyPrice: number;
  monthlyRent: number;
}

export interface SurfaceYieldResult {
  annualRent: number;
  surfaceYield: number;
  paybackYears: number;
}

export interface NetYieldInput {
  propertyPrice: number;
  monthlyRent: number;
  purchaseCost: number;
  annualManagementFee: number;
  annualRepairFund: number;
  annualPropertyTax: number;
  annualInsurance: number;
  vacancyRate: number;
  otherExpenses: number;
}

export interface NetYieldResult {
  annualRentWithVacancy: number;
  annualExpenses: number;
  annualNetIncome: number;
  totalInvestment: number;
  surfaceYield: number;
  netYield: number;
  monthlyNetIncome: number;
}

export type RepaymentType = 'equal-installment' | 'equal-principal';

export interface CashflowInput {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  loanYears: number;
  repaymentType: RepaymentType;
  monthlyRent: number;
  annualExpenses: number;
}

export interface CashflowResult {
  loanAmount: number;
  monthlyPayment: number;
  monthlyExpenses: number;
  monthlyCashflow: number;
  annualCashflow: number;
  cashflowYield: number;
  totalPayment: number;
  totalInterest: number;
}

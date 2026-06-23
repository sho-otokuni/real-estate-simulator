import { CashflowInput, CashflowResult } from '@/types/calculator';

export function calcCashflow(input: CashflowInput): CashflowResult | null {
  const { propertyPrice, downPayment, interestRate, loanYears, repaymentType, monthlyRent, annualExpenses } =
    input;

  if (propertyPrice <= 0) return null;

  const loanAmount = Math.max(0, propertyPrice - downPayment);
  const monthlyExpenses = annualExpenses / 12;

  let monthlyPayment = 0;
  let totalPayment = 0;

  if (loanAmount > 0) {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanYears * 12;

    if (repaymentType === 'equal-installment') {
      if (monthlyRate === 0) {
        monthlyPayment = loanAmount / totalMonths;
        totalPayment = loanAmount;
      } else {
        const factor = Math.pow(1 + monthlyRate, totalMonths);
        monthlyPayment = (loanAmount * monthlyRate * factor) / (factor - 1);
        totalPayment = monthlyPayment * totalMonths;
      }
    } else {
      // 元金均等：初月の返済額を代表値とする
      const monthlyPrincipal = loanAmount / totalMonths;
      const firstMonthInterest = loanAmount * monthlyRate;
      monthlyPayment = monthlyPrincipal + firstMonthInterest;
      totalPayment = loanAmount + (loanAmount * monthlyRate * (totalMonths + 1)) / 2;
    }
  }

  const totalInterest = totalPayment - loanAmount;
  const monthlyCashflow = monthlyRent - monthlyPayment - monthlyExpenses;
  const annualCashflow = monthlyCashflow * 12;
  const equityInvested = downPayment > 0 ? downPayment : propertyPrice;
  const cashflowYield = (annualCashflow / equityInvested) * 100;

  return {
    loanAmount,
    monthlyPayment,
    monthlyExpenses,
    monthlyCashflow,
    annualCashflow,
    cashflowYield,
    totalPayment,
    totalInterest,
  };
}

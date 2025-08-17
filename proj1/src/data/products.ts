export type Product = {
  id: string;
  title: string;
  description: string;
  icon?: "card" | "savings" | "bank";
  cta1?: string;
  cta2?: string;
};

export const productsByTab: Record<string, Product[]> = {
  Popular: [
    {
      id: "SAV",
      title: "Savings Account",
      description: "Earn up to 7% p.a. interest on savings.",
      icon: "savings",
    },
    {
      id: "FD",
      title: "Fixed Deposit",
      description: "Lock in attractive rates with flexible tenures.",
      icon: "bank",
    },
    {
      id: "PL",
      title: "Personal Loan",
      description: "Instant approval and flexible repayment.",
      icon: "bank",
    },
    {
      id: "CC",
      title: "Credit Cards",
      description: "Privileges and rewards on every spend.",
      icon: "card",
    },
  ],
  Accounts: [
    {
      id: "SAV-ZERO",
      title: "Zero Balance Savings",
      description: "Full-featured account with no minimum balance.",
      icon: "savings",
    },
    {
      id: "SAL",
      title: "Corporate Salary Account",
      description: "Hassle-free salary credit and benefits.",
      icon: "savings",
    },
    {
      id: "CUR",
      title: "Current Account",
      description: "Smart banking for businesses.",
      icon: "bank",
    },
  ],
  "Credit Cards": [
    {
      id: "LEG",
      title: "Legend Credit Card",
      description: "Premium lifestyle privileges and rewards.",
      icon: "card",
    },
    {
      id: "EZY",
      title: "EazyDiner Card",
      description: "Dining offers and foodie rewards.",
      icon: "card",
    },
    {
      id: "RUP",
      title: "Platinum RuPay",
      description: "Secure domestic acceptance with perks.",
      icon: "card",
    },
  ],
  Loans: [
    {
      id: "PL",
      title: "Personal Loan",
      description: "Quick funds at attractive rates.",
      icon: "bank",
    },
    {
      id: "BL",
      title: "Business Loan",
      description: "Fuel your business growth.",
      icon: "bank",
    },
    {
      id: "LAP",
      title: "Loan Against Property",
      description: "Unlock the value of your property.",
      icon: "bank",
    },
    {
      id: "VL",
      title: "Vehicle Loan",
      description: "Flexible finance for new/used vehicles.",
      icon: "bank",
    },
    {
      id: "HL",
      title: "Home Loan",
      description: "Competitive rates and fast processing.",
      icon: "bank",
    },
  ],
  "Digital Payments": [
    {
      id: "FASTAG",
      title: "FASTag",
      description: "Toll payments made effortless.",
      icon: "card",
    },
    {
      id: "UPI",
      title: "UPI (IndusPay)",
      description: "Transfer instantly with UPI.",
      icon: "card",
    },
    {
      id: "BQR",
      title: "Bharat QR",
      description: "Accept payments with QR.",
      icon: "card",
    },
  ],
  "Foreign Exchange": [
    {
      id: "FOREX",
      title: "Multicurrency Forex Card",
      description: "Travel with convenience and control.",
      icon: "card",
    },
    {
      id: "OR",
      title: "Outward Remittance",
      description: "Send money overseas securely.",
      icon: "bank",
    },
    {
      id: "IR",
      title: "Inward Remittance",
      description: "Receive international payments.",
      icon: "bank",
    },
  ],
};

export const TopSearches = [
  "Credit Card",
  "Saving Account",
  "Fixed Deposit",
  "Personal Loan",
];

export const SecurityTips = [
  "Never share your PIN or OTP with anyone.",
  "Always log off from internet banking after use.",
  "Use secure networks; avoid public Wi-Fi for banking.",
  "Report card loss immediately to customer care.",
];

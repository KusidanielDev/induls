export type MegaItem = {
  label: string;
  tag?: { text: string; color?: "success" | "warning" | "info" };
};
export type MegaColumn = { title: string; items: MegaItem[] };
export type MegaSection = {
  key: string;
  label: string;
  columns: MegaColumn[];
  quickLinks: string[];
  image?: string;
  // runtime only:
  onClose?: () => void;
};

const _green = (t: string): MegaItem =>
  ({ label: "", tag: { text: t, color: "success" } } as any);

export const NAV_SECTIONS: MegaSection[] = [
  {
    key: "accounts",
    label: "Accounts & Deposits",
    columns: [
      {
        title: "Accounts",
        items: [
          {
            label: "Savings Account",
            tag: { text: "Up to 5% p.a.", color: "success" },
          },
          { label: "Zero Balance Savings Account" },
          { label: "Corporate Salary Account" },
          { label: "Uniformed Personnel Account" },
          { label: "Current Account" },
        ],
      },
      {
        title: "Deposits",
        items: [
          {
            label: "Fixed Deposit",
            tag: { text: "Up to 7% p.a.", color: "success" },
          },
          { label: "Recurring Deposit" },
          {
            label: "Senior Citizen FD",
            tag: { text: "Up to 7.5% p.a.", color: "warning" },
          },
          { label: "Auto Sweep FD" },
        ],
      },
      {
        title: "Locker",
        items: [{ label: "Safe Deposit Locker" }],
      },
    ],
    quickLinks: [
      "Savings Account Interest Rate",
      "FD Calculator",
      "FD Interest Rates",
      "Open a Savings Account",
      "Open a Fixed Deposit",
      "CASA Welcome Kit",
      "FAQs",
      "Manage Mandate(s)",
    ],
    image: "/images/hero-2.jpg",
  },
  {
    key: "cards",
    label: "Cards",
    columns: [
      {
        title: "Cards",
        items: [
          { label: "Debit Card" },
          { label: "Duo Card" },
          { label: "Corporate Cards" },
          { label: "Business Cards" },
          { label: "Forex Card" },
          { label: "Tata Neu IndusInd Bank Forex Card" },
          { label: "Prepaid Card" },
        ],
      },
      {
        title: "IndusInd Bank Credit Cards",
        items: [
          { label: "Platinum RuPay Credit Card" },
          { label: "EazyDiner Credit Card" },
          { label: "Nexxt Credit Card" },
          { label: "Samman Credit Card" },
          { label: "Platinum Visa Credit Card" },
          {
            label: "EazyDiner Platinum Card",
            tag: { text: "Free", color: "info" },
          },
          { label: "View All Credit Cards" },
        ],
      },
      {
        title: "Premium & More",
        items: [
          { label: "Legend Credit Card" },
          { label: "Pinnacle Credit Card" },
          { label: "Tiger Credit Card", tag: { text: "Free", color: "info" } },
          { label: "Platinum Aura Edge Card" },
          { label: "Avios Visa Infinite Credit Card" },
          { label: "Credit Card Against FD" },
        ],
      },
    ],
    quickLinks: [
      "IndusInd Bank Offers",
      "Debit Card Related",
      "Credit Card Related",
      "Check Credit Card Rewards",
      "Apply for a Credit Card",
      "Apply for a RuPay Credit Card",
      "Important Updates on Credit Cards",
    ],
    image: "/images/hero-3.jpg",
  },
  {
    key: "loans",
    label: "Loans",
    columns: [
      {
        title: "Retail Loans",
        items: [
          {
            label: "Personal Loan",
            tag: { text: "2% PF (Limited Period)", color: "warning" },
          },
          { label: "Vehicle Loans" },
          { label: "Used Car Loan" },
          { label: "Affordable Home Loans" },
          { label: "Loan Against Property" },
          { label: "Loan on Credit Card" },
        ],
      },
      {
        title: "Business & More",
        items: [
          { label: "Business Loan" },
          { label: "New Car Loan" },
          { label: "Two Wheeler Loan" },
          { label: "Gold Loan" },
          { label: "Loan Against Securities" },
        ],
      },
      {
        title: "Specialised",
        items: [
          { label: "Agri Loan" },
          { label: "Medical Equipment Loan" },
          { label: "Home Loan" },
          { label: "Inclusive Banking" },
        ],
      },
    ],
    quickLinks: [
      "Personal Loan EMI Calculator",
      "Apply for a Personal Loan",
      "Apply for Business Loan",
    ],
    image: "/images/hero-1.jpg",
  },
  {
    key: "apply",
    label: "Apply Online",
    columns: [
      {
        title: "Accounts & Deposits",
        items: [
          {
            label: "Savings Account",
            tag: { text: "Up to 5% p.a.", color: "success" },
          },
          {
            label: "Fixed Deposit",
            tag: { text: "Up to 7% p.a.", color: "success" },
          },
          { label: "Current Account" },
        ],
      },
      {
        title: "Cards & Loans",
        items: [
          { label: "Personal Loan" },
          { label: "Affordable Home Loans" },
          { label: "MSME Loans" },
          { label: "Mutual Funds" },
          { label: "Govt. Social Security Schemes" },
          { label: "Set up E-Mandate" },
          { label: "Home Loan" },
        ],
      },
      {
        title: "More",
        items: [
          { label: "Business Loan" },
          { label: "Vehicle Loans" },
          { label: "FASTag" },
          { label: "Send Money Abroad" },
          { label: "Insurance - IndiQwik" },
          { label: "Udyam Registration" },
        ],
      },
    ],
    quickLinks: ["V-KYC", "Re-KYC", "Get Mini Statement", "Refer A Friend"],
    image: "/images/hero-2.jpg",
  },
  {
    key: "digital",
    label: "Digital Banking",
    columns: [
      {
        title: "Digital Platforms",
        items: [
          { label: "INDIE for Business" },
          { label: "IndusInd Bank NetBanking" },
          { label: "IndusInd Bank Video Branch" },
          { label: "UPI BHIM IndusPay" },
          { label: "FASTag" },
        ],
      },
      {
        title: "Mobile & More",
        items: [
          { label: "IndusInd Bank Mobile App — INDIE" },
          { label: "WhatsApp Banking" },
          { label: "Setup E-mandate" },
          { label: "IndusInd Bank UPI" },
          { label: "Bharat QR" },
        ],
      },
      {
        title: "Make Payments",
        items: [
          { label: "Credit Card Bill Payment" },
          { label: "Click Pay" },
          { label: "Send Money Abroad" },
          { label: "Loan Repayment" },
          { label: "Pay Insurance Premium" },
          { label: "Digital Rupee" },
          { label: "Bill Payment" },
        ],
      },
    ],
    quickLinks: ["Blogs", "Schedule of Charges"],
    image: "/images/hero-3.jpg",
  },
  {
    key: "rates",
    label: "% Rates & Offers",
    columns: [
      {
        title: "Interest Rates",
        items: [
          {
            label: "Savings Account",
            tag: { text: "Up to 5% p.a.", color: "success" },
          },
          {
            label: "Fixed Deposit",
            tag: { text: "Up to 7% p.a.", color: "success" },
          },
          {
            label: "FD for Sr. Citizen",
            tag: { text: "Up to 7.5% p.a.", color: "warning" },
          },
          { label: "View All Interest Rates" },
        ],
      },
      {
        title: "Offers",
        items: [
          { label: "IndusInd Bank Offers" },
          { label: "Credit Card Rewards" },
          { label: "Forex Card" },
          { label: "Get Rewarded for Using UPI on INDIE" },
          { label: "Beyond Banking Solutions" },
        ],
      },
      { title: "—", items: [] },
    ],
    quickLinks: [
      "Open a Savings Account",
      "Open a Fixed Deposit",
      "Calculators",
    ],
    image: "/images/hero-1.jpg",
  },
  {
    key: "invest",
    label: "Investments & Insurance",
    columns: [
      {
        title: "Foreign Exchange",
        items: [
          { label: "Forex Card" },
          { label: "Inward Remittances" },
          { label: "Outward Remittances" },
          { label: "IndusForex Portal" },
          { label: "FX Retail" },
          { label: "Tata Neu IndusInd Bank Forex Card" },
        ],
      },
      {
        title: "Wealth & Insurance",
        items: [
          { label: "Mutual Funds", tag: { text: "New", color: "info" } },
          { label: "Alternate Products" },
          { label: "National Pension System" },
          { label: "Insurance for Me & My Family" },
        ],
      },
      {
        title: "More",
        items: [
          { label: "Sovereign Gold Bonds" },
          { label: "Government Securities" },
          { label: "ASBA" },
          { label: "Insurance for Business" },
        ],
      },
    ],
    quickLinks: ["Goal Calculator", "SIP Calculator", "Retirement Calculator"],
    image: "/images/hero-2.jpg",
  },
];

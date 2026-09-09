export type Txn = {
  id: string;
  title: string;
  time: string;
  category: string;
  amount: number;
  kind: "deposit" | "debit";
  date: string; // grouping label
  status: string;
  method: string;
};

export const CHECKING_BALANCE = 30.29;
export const ROUTING_NUMBER = "103100195";
export const ACCOUNT_NUMBER = "•••• •••• 4821";

export const transactions: Txn[] = [
  {
    id: "t1",
    title: "Direct Debit: One Finance, Inc, Ach Trans",
    time: "12:05 AM",
    category: "Other",
    amount: -5,
    kind: "debit",
    date: "Monday, September 29th",
    status: "Completed",
    method: "ACH transfer",
  },
  {
    id: "t2",
    title: "One Finance, Inc, Ach Trans",
    time: "6:35 PM",
    category: "Deposit",
    amount: 20,
    kind: "deposit",
    date: "Sunday, September 28th",
    status: "Completed",
    method: "ACH transfer",
  },
  {
    id: "t3",
    title: "Qube, Qube Money",
    time: "2:06 AM",
    category: "Deposit",
    amount: 10,
    kind: "deposit",
    date: "Thursday, September 25th",
    status: "Completed",
    method: "ACH transfer",
  },
  {
    id: "t4",
    title: "Direct Debit: Qube, Qube Money",
    time: "11:41 PM",
    category: "Other",
    amount: -4.71,
    kind: "debit",
    date: "Tuesday, September 23rd",
    status: "Completed",
    method: "ACH transfer",
  },
  {
    id: "t5",
    title: "One Finance, Inc, Ach Trans",
    time: "9:12 AM",
    category: "Deposit",
    amount: 15,
    kind: "deposit",
    date: "Friday, September 19th",
    status: "Completed",
    method: "ACH transfer",
  },
];

export const money = (n: number) =>
  `${n < 0 ? "-" : "+"}$${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function groupByDate(list: Txn[]) {
  const groups: { date: string; items: Txn[] }[] = [];
  for (const t of list) {
    const last = groups[groups.length - 1];
    if (last && last.date === t.date) last.items.push(t);
    else groups.push({ date: t.date, items: [t] });
  }
  return groups;
}

export type MonthInsight = {
  key: string;
  label: string;
  monthName: string;
  spent: number;
  deposited: number;
  categories: { name: string; amount: number }[];
  merchants: { name: string; amount: number }[];
};

export const insights: MonthInsight[] = [
  {
    key: "may",
    label: "May",
    monthName: "May",
    spent: 15,
    deposited: 18.79,
    categories: [{ name: "Other", amount: 15 }],
    merchants: [{ name: "One Finance, Inc", amount: 15 }],
  },
  { key: "jun", label: "Jun", monthName: "June", spent: 0, deposited: 0, categories: [], merchants: [] },
  { key: "jul", label: "Jul", monthName: "July", spent: 0, deposited: 0, categories: [], merchants: [] },
  { key: "aug", label: "Aug", monthName: "August", spent: 0, deposited: 0, categories: [], merchants: [] },
  {
    key: "sep",
    label: "Sep",
    monthName: "September",
    spent: 5,
    deposited: 30,
    categories: [{ name: "Other", amount: 5 }],
    merchants: [
      { name: "One Finance, Inc", amount: 5 },
      { name: "Qube Money", amount: 4.71 },
    ],
  },
  { key: "oct", label: "Oct", monthName: "October", spent: 0, deposited: 0, categories: [], merchants: [] },
];

export const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const CARDHOLDER = "DENIS TRUFIN";
export const CARD_LAST4 = "4821";
export const CARD_FULL_NUMBER = "4147 2029 8814 4821";
export const CARD_EXP = "09/29";
export const CARD_CVV = "418";

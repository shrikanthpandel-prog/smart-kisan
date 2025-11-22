import api from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * Khatabook Service
 * Handles money management (income/expense tracking)
 */

export interface MoneyTransaction {
  _id?: string;
  user?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
  date: string;
  createdAt?: string;
}

/**
 * Get all transactions for current user
 */
export async function getTransactions(): Promise<MoneyTransaction[]> {
  const response = await api.get<MoneyTransaction[]>(API_ENDPOINTS.MONEY.GET_ALL);
  return response.data;
}

/**
 * Add a new transaction
 */
export async function addTransaction(transaction: Omit<MoneyTransaction, '_id' | 'user' | 'createdAt'>): Promise<MoneyTransaction> {
  const response = await api.post<MoneyTransaction>(API_ENDPOINTS.MONEY.ADD, transaction);
  return response.data;
}

/**
 * Calculate balance from transactions
 */
export function calculateBalance(transactions: MoneyTransaction[]): {
  totalIncome: number;
  totalExpense: number;
  balance: number;
} {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

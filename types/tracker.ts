export type TransactionType = 'income' | 'expense';

export type Category =
    | 'food'
    | 'transport'
    | 'bills'
    | 'shopping'
    | 'entertainment'
    | 'salary'
    | 'freelance'
    | 'other';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    category: Category;
    description: string;
    date: string;
}

export interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    category?: string;
    icon?: string;
    status: 'in_progress' | 'completed';
}
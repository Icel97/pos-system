export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface Branch {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    is_warehouse: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
}

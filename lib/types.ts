export type Operation = '+' | '-' | '*' | '/';

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CalculationNode {
  id: number;
  userId: number;
  username: string;
  parentId: number | null;
  value: number;
  operation: Operation | null;
  operand: number | null;
  createdAt: string;
  children: CalculationNode[];
}

export interface CreateCalculationDto {
  value: number;
}

export interface CreateOperationDto {
  operation: Operation;
  operand: number;
}

export interface ApiError {
  error: string;
}

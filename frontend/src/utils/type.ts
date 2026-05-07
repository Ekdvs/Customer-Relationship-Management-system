export interface Lead {
  _id?: string;
  leadName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  leadSource: string;
  status: string;
  dealValue: number;
  priority?: string;
  score?: number;
  followUpDate?: string;
  tags?: string[];
  assignedTo?: { name: string; email: string };
  createdAt?: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualified: number;
  won: number;
  lost: number;
  totalDealValue: number;
  wonDealValue: number;
  conversionRate: number;
  avgDealValue: number;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

export interface Note {
  _id: string;
  content: string;
  type: string;
  createdBy: { name: string; email: string };
  createdAt: string;
}

export interface Activity {
  _id: string;
  message: string;
  type: string;
  createdBy: { name: string; email: string };
  createdAt: string;
}
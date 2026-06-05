const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  classification: 'Hot' | 'Warm' | 'Cold';
  suggested_reply: string;
  status: 'Pending' | 'Contacted';
  created_at: string;
}

export const api = {
  async getLeads(): Promise<Lead[]> {
    const res = await fetch(`${API_URL}/leads`);
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },

  async markAsContacted(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/lead/${id}/contacted`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to update lead');
  },

  async classifyMessage(message: string): Promise<{ classification: string; suggested_reply: string }> {
    const res = await fetch(`${API_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error('Failed to classify message');
    return res.json();
  }
};

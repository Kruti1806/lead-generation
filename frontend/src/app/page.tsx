'use client';

import { useState, useEffect } from 'react';
import { api, Lead } from '@/services/api';
import LeadTable from '@/components/LeadTable';
import FilterDropdown from '@/components/FilterDropdown';

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await api.getLeads();
      setLeads(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch leads. Make sure the backend is running at http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkContacted = async (id: number) => {
    try {
      await api.markAsContacted(id);
      fetchLeads(); // Refresh data
    } catch (err) {
      alert('Error updating lead status');
    }
  };

  const filteredLeads = leads.filter((lead) => 
    filter === 'All' ? true : lead.classification === filter
  );

  const leadStats = {
    Hot: leads.filter(l => l.classification === 'Hot').length,
    Warm: leads.filter(l => l.classification === 'Warm').length,
    Cold: leads.filter(l => l.classification === 'Cold').length,
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Lead Automation <span className="text-indigo-600">Dashboard</span>
              </h1>
              <p className="mt-2 text-slate-500">
                Qualify, respond, and manage your sales pipeline with AI.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchLeads}
                className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-red-500 uppercase tracking-wider">Hot Leads</p>
              <h3 className="text-4xl font-bold text-slate-900 mt-1">{leadStats.Hot}</h3>
              <div className="mt-4 h-1.5 w-full bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${(leadStats.Hot / (leads.length || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-yellow-500 uppercase tracking-wider">Warm Leads</p>
              <h3 className="text-4xl font-bold text-slate-900 mt-1">{leadStats.Warm}</h3>
              <div className="mt-4 h-1.5 w-full bg-yellow-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${(leadStats.Warm / (leads.length || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-blue-500 uppercase tracking-wider">Cold Leads</p>
              <h3 className="text-4xl font-bold text-slate-900 mt-1">{leadStats.Cold}</h3>
              <div className="mt-4 h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(leadStats.Cold / (leads.length || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters and Search Bar Container */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <FilterDropdown currentFilter={filter} onFilterChange={setFilter} />
          
          <div className="text-sm text-slate-400">
            Showing <span className="font-semibold text-slate-700">{filteredLeads.length}</span> out of {leads.length} leads
          </div>
        </div>

        {/* Main Content Area */}
        {loading && leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
             <p className="text-slate-500 font-medium">Connecting to AI engine...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-8 rounded-2xl text-center">
            <p className="font-bold text-lg">Backend Unreachable</p>
            <p className="mt-1">{error}</p>
            <button 
              onClick={fetchLeads}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all font-sans"
            >
              Try Again
            </button>
          </div>
        ) : (
          <LeadTable leads={filteredLeads} onMarkContacted={handleMarkContacted} />
        )}

        <footer className="mt-12 text-center text-slate-400 text-sm pb-8">
          Founder's Vibe © 2026 • Automated with Claude 3.5 & FastAPI
        </footer>
      </div>
    </main>
  );
}

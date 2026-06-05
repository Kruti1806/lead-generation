'use client';

import { Lead } from '@/services/api';

interface LeadRowProps {
  lead: Lead;
  onMarkContacted: (id: number) => void;
}

export default function LeadRow({ lead, onMarkContacted }: LeadRowProps) {
  const classificationColors = {
    Hot: 'bg-red-100 text-red-800 border-red-200',
    Warm: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Cold: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
      <td className="px-4 py-4 text-sm text-gray-600">
        <div className="flex flex-col">
          <span>{lead.email}</span>
          <span className="text-xs text-gray-400">{lead.phone}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">{lead.source}</td>
      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate" title={lead.message}>
        {lead.message}
      </td>
      <td className="px-4 py-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classificationColors[lead.classification]}`}>
          {lead.classification}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 italic">
        "{lead.suggested_reply}"
      </td>
      <td className="px-4 py-4">
        <span className={`text-xs font-medium ${lead.status === 'Contacted' ? 'text-green-600' : 'text-orange-600'}`}>
          {lead.status}
        </span>
      </td>
      <td className="px-4 py-4 text-right text-sm font-medium">
        {lead.status === 'Pending' && (
          <button
            onClick={() => onMarkContacted(lead.id)}
            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md transition-colors"
          >
            Mark Contacted
          </button>
        )}
      </td>
    </tr>
  );
}

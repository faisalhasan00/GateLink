import React from 'react';
import { Eye, MousePointer } from 'lucide-react';

export default function CampaignsTable({ campaigns }) {
  return (
    <div className="card">
      <div
        className="card-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 className="card-title">
          Promotional Ad Banners & Cross-Society Campaigns
        </h3>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {campaigns.length} Active Campaigns
        </span>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Campaign Title</th>
              <th>Sponsor / Client</th>
              <th>Target Audience</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    padding: '24px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  No campaigns yet. Create your first one!
                </td>
              </tr>
            ) : (
              campaigns.map((ad) => (
                <tr key={ad.id}>
                  <td>
                    <strong>{ad.title}</strong>
                  </td>
                  <td>{ad.sponsor}</td>
                  <td>{ad.target}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={14} />{' '}
                      {ad.impressions?.toLocaleString() || 0}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--primary)',
                        fontWeight: 700,
                      }}
                    >
                      <MousePointer size={14} />{' '}
                      {ad.clicks?.toLocaleString() || 0}
                    </span>
                  </td>
                  <td>
                    <span className="badge success">
                      {ad.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

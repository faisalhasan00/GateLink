import React from 'react';

export default function InteriorsComparisonTable() {
  const comparisonRows = [
    {
      id: 1,
      feature: 'End-to-end ownership',
      gatelink: 'One accountable team and a project manager, design to handover',
      localVendor: 'You coordinate the designer, carpenters and contractors yourself'
    },
    {
      id: 2,
      feature: 'Design & space',
      gatelink: 'Architect-led 3D design, up to 20% extra storage',
      localVendor: 'Rough-sketch layouts; space rarely optimised'
    },
    {
      id: 3,
      feature: 'Transparent pricing',
      gatelink: 'Fixed, itemised quote up front',
      localVendor: 'An estimate that can climb during the work'
    },
    {
      id: 4,
      feature: 'Quality & after-sales',
      gatelink: '146 quality checks; up-to-10-year warranty with dedicated after-sales',
      localVendor: 'Informal checks; after-sales hard to trace'
    },
    {
      id: 5,
      feature: 'Proven track record',
      gatelink: '15,000+ homes over 11+ years',
      localVendor: 'Word-of-mouth record, hard to verify'
    },
    {
      id: 6,
      feature: 'Factory build',
      gatelink: 'Our own 65,000 sq ft factory, Hettich & Häfele hardware, viewable at our Experience Centres',
      localVendor: 'Hand-built on-site; usually no showroom'
    }
  ];

  return (
    <section className="interiors-comparison-section">
      <div className="interiors-comparison-container">
        {/* Section Header */}
        <div className="interiors-comparison-header">
          <h2 className="interiors-comparison-title">
            Why Choose Our Interior Designers In Hyderabad?
          </h2>
        </div>

        {/* Comparison Table Card */}
        <div className="interiors-comparison-table-wrapper">
          <table className="interiors-comparison-table">
            <thead>
              <tr>
                <th className="th-feature">What matters</th>
                <th className="th-gatelink">GateLink Interiors</th>
                <th className="th-local">A typical local interior vendor</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.id}>
                  <td className="td-feature">{row.feature}</td>
                  <td className="td-gatelink">{row.gatelink}</td>
                  <td className="td-local">{row.localVendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

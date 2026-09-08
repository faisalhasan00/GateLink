import React, { useState, useMemo } from 'react';
import { Calculator, Check, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

const FLAT_SIZES = [
  { id: '1bhk', label: '1 BHK', multiplier: 0.85 },
  { id: '2bhk', label: '2 BHK', multiplier: 1.0 },
  { id: '3bhk', label: '3 BHK', multiplier: 1.35 },
  { id: '4bhk', label: '4 BHK / Duplex', multiplier: 1.7 },
];

const TASKS = [
  { id: 'mop', label: 'Floor Sweeping & Mopping', monthlyCost: 1200, onDemandCost: 99 },
  { id: 'dishes', label: 'Utensils & Dishwashing', monthlyCost: 900, onDemandCost: 89 },
  { id: 'cooking', label: 'Cooking (2 Meals / Day)', monthlyCost: 2400, onDemandCost: 199 },
  { id: 'bathrooms', label: 'Bathroom Cleaning (2x / wk)', monthlyCost: 800, onDemandCost: 149 },
  { id: 'dusting', label: 'Deep Dusting & Balcony', monthlyCost: 600, onDemandCost: 79 },
];

export default function MaidsPricingCalculator({ onOpenBooking }) {
  const [model, setModel] = useState('monthly'); // 'monthly' | 'ondemand'
  const [flatSize, setFlatSize] = useState('2bhk');
  const [selectedTasks, setSelectedTasks] = useState(['mop', 'dishes']);

  const toggleTask = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      if (selectedTasks.length === 1) return; // keep at least one
      setSelectedTasks(selectedTasks.filter((t) => t !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const calculatedEstimate = useMemo(() => {
    const flatObj = FLAT_SIZES.find((f) => f.id === flatSize) || FLAT_SIZES[1];
    let baseSum = 0;

    selectedTasks.forEach((taskId) => {
      const task = TASKS.find((t) => t.id === taskId);
      if (task) {
        baseSum += model === 'monthly' ? task.monthlyCost : task.onDemandCost;
      }
    });

    const finalAmount = Math.round((baseSum * flatObj.multiplier) / 10) * 10;
    return finalAmount;
  }, [model, flatSize, selectedTasks]);

  const handleBook = () => {
    const flatLabel = FLAT_SIZES.find((f) => f.id === flatSize)?.label;
    const taskNames = selectedTasks.map((id) => TASKS.find((t) => t.id === id)?.label).join(', ');

    if (onOpenBooking) {
      onOpenBooking({
        model: model === 'monthly' ? 'Monthly Recurring Helper' : 'On-Demand Instant Helper',
        flatSize: flatLabel,
        tasks: taskNames,
        estimatedPrice: model === 'monthly' ? `₹${calculatedEstimate} / month` : `₹${calculatedEstimate} / session`,
      });
    }
  };

  return (
    <section id="calculator" className="maids-calculator-section">
      <div className="maids-section-header">
        <div className="maids-badge">
          <Calculator size={14} />
          <span>Transparent Rates</span>
        </div>
        <h2 className="maids-section-title">
          Custom House Help Cost Calculator
        </h2>
        <p className="maids-section-subtitle">
          Zero middleman brokerage. Calculate your transparent helper salary or on-demand rate.
        </p>
      </div>

      <div className="calculator-card">
        {/* Model Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div
            style={{
              background: '#FAFAF9',
              border: '1px solid #E7E5E4',
              borderRadius: '999px',
              padding: '4px',
              display: 'inline-flex',
            }}
          >
            <button
              type="button"
              onClick={() => setModel('monthly')}
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                border: 'none',
                background: model === 'monthly' ? '#D97706' : 'transparent',
                color: model === 'monthly' ? '#FFFFFF' : '#44403C',
                fontWeight: '700',
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📅 Monthly Dedicated Helper
            </button>
            <button
              type="button"
              onClick={() => setModel('ondemand')}
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                border: 'none',
                background: model === 'ondemand' ? '#D97706' : 'transparent',
                color: model === 'ondemand' ? '#FFFFFF' : '#44403C',
                fontWeight: '700',
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ⚡ 15-Min On-Demand Visit
            </button>
          </div>
        </div>

        {/* Flat Size */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
            1. Select Flat Size
          </label>
          <div className="calc-options-row">
            {FLAT_SIZES.map((fs) => (
              <button
                key={fs.id}
                type="button"
                className={`calc-pill-btn ${flatSize === fs.id ? 'active' : ''}`}
                onClick={() => setFlatSize(fs.id)}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Selection */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
            2. Select Daily Tasks Needed
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {TASKS.map((task) => {
              const isSelected = selectedTasks.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  style={{
                    background: isSelected ? '#FFFBEB' : '#FAFAF9',
                    border: isSelected ? '1.5px solid #D97706' : '1px solid #E7E5E4',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1C1917' }}>
                    {task.label}
                  </span>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      background: isSelected ? '#D97706' : '#E7E5E4',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <Check size={14} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Result Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '18px',
            padding: '24px 30px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {model === 'monthly' ? 'Recommended Monthly Rate' : 'Estimated Single Visit Cost'}
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#FBBF24', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              ₹{calculatedEstimate.toLocaleString()}
              <span style={{ fontSize: '1rem', color: '#E2E8F0', fontWeight: '500', marginLeft: '6px' }}>
                {model === 'monthly' ? '/ month' : '/ session'}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
              🔒 100% Direct Staff Payout • ₹0 Brokerage • Gate Pass Included
            </div>
          </div>

          <button
            onClick={handleBook}
            className="maids-btn-primary"
            style={{ padding: '14px 24px', fontSize: '0.95rem' }}
          >
            <Zap size={18} />
            <span>Book Verified Helper</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

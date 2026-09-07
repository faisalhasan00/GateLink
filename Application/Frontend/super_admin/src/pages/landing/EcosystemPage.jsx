import React, { useState } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import DemoModal from './DemoModal';
import { ECOSYSTEM_NODES } from './ecosystem/ecosystemNodesData';
import EcosystemHeroSection from './ecosystem/EcosystemHeroSection';
import EcosystemNodeFlowBar from './ecosystem/EcosystemNodeFlowBar';
import EcosystemNodeDetails from './ecosystem/EcosystemNodeDetails';

export default function EcosystemPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState('visitor');

  const selectedNode = ECOSYSTEM_NODES.find((n) => n.id === selectedNodeId) || ECOSYSTEM_NODES[0];

  return (
    <div style={{ backgroundColor: '#020617', color: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Navbar onOpenDemo={() => setIsDemoModalOpen(true)} />

      <EcosystemHeroSection />

      {/* Interactive Ecosystem Visualization Canvas */}
      <section style={{ padding: '40px 0 100px 0', background: '#020617', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <EcosystemNodeFlowBar
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />

          <EcosystemNodeDetails
            selectedNode={selectedNode}
            onOpenDemo={() => setIsDemoModalOpen(true)}
          />
        </div>
      </section>

      <FooterSection />
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}

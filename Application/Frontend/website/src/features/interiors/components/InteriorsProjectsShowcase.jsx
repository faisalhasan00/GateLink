import React from 'react';

export default function InteriorsProjectsShowcase({ onOpenConsultation }) {
  const projects = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85',
      title: "Bhanu Prakash's Hyderabad Villa With Modern Interiors",
      alt: "Bhanu Prakash's luxury villa interior project in Hyderabad"
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
      title: "Hari And His Family's Modern-Hyderabadi Home",
      alt: "Hari and family's modern Hyderabadi home interior transformation"
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      title: "Ravikiran's 3BHK Home In Hyderabad",
      alt: "Ravikiran's 3BHK premium apartment interior project in Hyderabad"
    }
  ];

  return (
    <section className="interiors-projects-showcase-section">
      <div className="interiors-projects-showcase-container">
        {/* Section Header */}
        <div className="interiors-projects-header">
          <h2 className="interiors-projects-title">
            Latest Home Interior Projects In Hyderabad
          </h2>
        </div>

        {/* 3-Column Projects Grid */}
        <div className="interiors-projects-grid">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="interiors-projects-card"
              onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Real Projects', project: project.title })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onOpenConsultation && onOpenConsultation({ space: 'Real Projects', project: project.title });
                }
              }}
            >
              <div className="interiors-projects-image-wrapper">
                <img 
                  src={project.image} 
                  alt={project.alt} 
                  className="interiors-projects-image"
                  loading="lazy"
                />
              </div>
              <p className="interiors-projects-caption">
                {project.title}
              </p>
            </div>
          ))}
        </div>

        {/* Centered Action Link / Button Matching Reference */}
        <div className="interiors-projects-cta-row">
          <button
            type="button"
            className="interiors-projects-link-teal"
            onClick={() => onOpenConsultation && onOpenConsultation({ space: 'Projects Portfolio', topic: 'View All Projects' })}
          >
            <span>View All Projects</span>
          </button>
        </div>
      </div>
    </section>
  );
}

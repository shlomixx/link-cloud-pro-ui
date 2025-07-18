import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

// Impact Ring Component
const ImpactRing = () => (
  <div className="relative w-48 h-48 mx-auto my-8">
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
      {/* Background circle */}
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth="2"
      />
      {/* Progress circle - 75% progress */}
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="hsl(var(--terra-green))"
        strokeWidth="2"
        strokeDasharray="75, 100"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-4xl font-heading font-semibold text-terra-green">-15%</span>
      <span className="text-sm text-terra-gray">CO₂ this month</span>
    </div>
  </div>
);

// Action Card Component
const ActionCard = ({ title, points }: { title: string; points: number }) => (
  <div className="flex-shrink-0 w-64 p-4 bg-card rounded-xl shadow-md border border-border flex items-center justify-between hover-lift">
    <p className="font-medium text-foreground">{title}</p>
    <Button size="sm" className="bg-terra-blue hover:bg-terra-blue-light text-white rounded-full">
      <Zap size={16} className="mr-2"/>
      {points} pts
    </Button>
  </div>
);

const Home = () => {
  const todayActions = [
    { title: "Walk to work", points: 50 },
    { title: "Meatless Monday", points: 75 },
    { title: "Shorter shower", points: 30 },
    { title: "Use public transport", points: 40 },
  ];

  return (
    <div className="container mx-auto p-4">
      <header className="py-4">
        <h1 className="text-3xl font-heading font-semibold text-foreground">Welcome Back!</h1>
        <p className="text-terra-gray">Let's make a positive impact today.</p>
      </header>
      
      <ImpactRing />
      
      <section className="mb-8">
        <h2 className="text-xl font-heading font-semibold mb-4 text-foreground">Your Actions for Today</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
          {todayActions.map((action) => (
            <ActionCard 
              key={action.title} 
              title={action.title} 
              points={action.points} 
            />
          ))}
        </div>
      </section>
      
      <section className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-heading font-semibold mb-3 text-foreground">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-terra-green">342</div>
            <div className="text-sm text-terra-gray">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-terra-blue">12</div>
            <div className="text-sm text-terra-gray">Actions This Week</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
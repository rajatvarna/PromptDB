import React, { useState, useEffect, useCallback } from 'react';

interface TourStep {
  targetId?: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
  onComplete: () => void;
}

const STEPS: TourStep[] = [
  {
    title: "Welcome to PromptDB",
    content: "Discover a curated collection of expert AI prompts for investment research, industry analysis, and more. Let's take a quick tour.",
    position: 'center'
  },
  {
    targetId: 'tour-search-filter',
    title: "Find Exactly What You Need",
    content: "Use the search bar to find keywords, or filter prompts by category to narrow down your focus.",
    position: 'bottom'
  },
  {
    targetId: 'tour-fav-btn',
    title: "Save Your Favorites",
    content: "Found a prompt you love? Click the heart icon to save it to your personal collection for quick access later.",
    position: 'left' // usually to the left of the button if it's on the right edge
  },
  {
    targetId: 'tour-run-btn',
    title: "Run Instantly with AI",
    content: "Don't just copy-paste. Click 'Run with AI' to execute the prompt immediately using Gemini, with custom variables.",
    position: 'top'
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const [isVisible, setIsVisible] = useState(false);

  const currentStep = STEPS[currentStepIndex];

  const updatePosition = useCallback(() => {
    if (currentStep.position === 'center') {
      setTooltipStyle({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed'
      });
      setArrowStyle({ display: 'none' });
      setIsVisible(true);
      return;
    }

    if (!currentStep.targetId) return;

    const element = document.getElementById(currentStep.targetId);
    if (!element) {
      // Element not found, might be off screen or filtered out. Skip step or fallback.
      console.warn(`Tour target ${currentStep.targetId} not found.`);
      setTooltipStyle({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed'
      });
      setIsVisible(true);
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Allow a small delay for scroll
    setTimeout(() => {
      const rect = element.getBoundingClientRect();
      const padding = 12;
      
      let style: React.CSSProperties = { position: 'fixed' };
      let arrow: React.CSSProperties = {};
      
      // Determine if we are in dark mode to adjust arrow color roughly (though CSS handles it better usually)
      // Here we rely on JS styles so we might assume white arrow for light mode, dark for dark mode?
      // Since this is inline style, we'll stick to a neutral or check classList.
      const isDark = document.documentElement.classList.contains('dark');
      const arrowColor = isDark ? '#1e293b' : 'white'; // slate-800 vs white

      switch (currentStep.position) {
        case 'bottom':
          style.top = rect.bottom + padding;
          style.left = rect.left + rect.width / 2;
          style.transform = 'translateX(-50%)';
          arrow = { top: -6, left: '50%', marginLeft: -6, borderBottomColor: arrowColor, borderTopWidth: 0 };
          break;
        case 'top':
          style.top = rect.top - padding;
          style.left = rect.left + rect.width / 2;
          style.transform = 'translate(-50%, -100%)';
          arrow = { bottom: -6, left: '50%', marginLeft: -6, borderTopColor: arrowColor, borderBottomWidth: 0 };
          break;
        case 'left':
          style.top = rect.top + rect.height / 2;
          style.left = rect.left - padding;
          style.transform = 'translate(-100%, -50%)';
          arrow = { right: -6, top: '50%', marginTop: -6, borderLeftColor: arrowColor, borderRightWidth: 0 };
          break;
        case 'right':
          style.top = rect.top + rect.height / 2;
          style.left = rect.right + padding;
          style.transform = 'translate(0, -50%)';
          arrow = { left: -6, top: '50%', marginTop: -6, borderRightColor: arrowColor, borderLeftWidth: 0 };
          break;
      }

      setTooltipStyle(style);
      setArrowStyle(arrow);
      setIsVisible(true);
    }, 500);

  }, [currentStep, currentStepIndex]);

  useEffect(() => {
    setIsVisible(false);
    // Small timeout to allow DOM updates
    const timer = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    // Also listen for dark mode changes if we want live arrow updates, 
    // but simpler to just re-render on step change.
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [currentStepIndex, updatePosition]);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto transition-opacity duration-300" />

      {/* Tooltip Card */}
      <div 
        className="absolute w-[320px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 pointer-events-auto transition-all duration-300 ease-out border border-slate-100/50 dark:border-slate-700"
        style={tooltipStyle}
      >
        {/* Arrow */}
        {currentStep.position !== 'center' && (
          <div 
            className="absolute w-0 h-0 border-solid border-6 border-transparent"
            style={arrowStyle}
          />
        )}

        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
            <button onClick={handleSkip} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{currentStep.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {currentStep.content}
          </p>

          <div className="flex justify-between items-center mt-auto">
             <div className="flex gap-1">
               {STEPS.map((_, idx) => (
                 <div 
                   key={idx} 
                   className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-6 bg-indigo-600 dark:bg-indigo-500' : 'w-1.5 bg-slate-200 dark:bg-slate-600'}`}
                 />
               ))}
             </div>
             <button
               onClick={handleNext}
               className="bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
             >
               {currentStepIndex === STEPS.length - 1 ? "Get Started" : "Next"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
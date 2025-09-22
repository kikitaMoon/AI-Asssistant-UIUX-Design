import React, { useState, useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';

interface ReasoningStep {
  title: string;
  description: string;
}

interface ReasoningShowcaseProps {
  isActive: boolean;
  onComplete?: () => void;
}

const DEMO_STEPS: ReasoningStep[] = [
  {
    title: "Understanding the query",
    description: "I analyze the user's request to identify the core requirements and context needed to provide an accurate response."
  },
  {
    title: "Gathering relevant information", 
    description: "I search through my knowledge base and identify the most relevant concepts, facts, and patterns related to the query."
  },
  {
    title: "Structuring the approach",
    description: "I organize my thoughts and determine the logical flow of information that will best address the user's needs."
  },
  {
    title: "Generating the response",
    description: "I synthesize all gathered information into a clear, comprehensive answer that directly addresses the original question."
  },
  {
    title: "Review and refinement",
    description: "I review my response for accuracy, clarity, and completeness to ensure it meets the highest quality standards."
  }
];

export const ReasoningShowcase: React.FC<ReasoningShowcaseProps> = ({
  isActive,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [streamingText, setStreamingText] = useState('');
  const [isStreamingTitle, setIsStreamingTitle] = useState(false);
  const [isStreamingDescription, setIsStreamingDescription] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<ReasoningStep[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(-1);
      setStreamingText('');
      setIsStreamingTitle(false);
      setIsStreamingDescription(false);
      setCompletedSteps([]);
      return;
    }

    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    const runShowcase = async () => {
      setCompletedSteps([]);

      for (let i = 0; i < DEMO_STEPS.length; i++) {
        if (cancelled) break;
        setCurrentStep(i);
        const step = DEMO_STEPS[i];

        // Stream title (faster) and auto-scroll
        setIsStreamingTitle(true);
        setStreamingText('');
        for (let j = 0; j <= step.title.length; j++) {
          if (cancelled) break;
          setStreamingText(step.title.substring(0, j));
          if (j % 3 === 0) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          await sleep(15);
        }
        setIsStreamingTitle(false);
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        await sleep(200);

        // Stream description (faster) and auto-scroll
        setIsStreamingDescription(true);
        setStreamingText('');
        for (let j = 0; j <= step.description.length; j++) {
          if (cancelled) break;
          setStreamingText(step.description.substring(0, j));
          if (j % 5 === 0) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          await sleep(12);
        }
        setIsStreamingDescription(false);

        // Add completed step to the list
        setCompletedSteps((prev) => [...prev, step]);
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        await sleep(400);
      }

      setCurrentStep(-1);
      onComplete?.();
    };

    runShowcase();

    return () => {
      cancelled = true;
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="border-l-2 border-primary/30 pl-4 space-y-3 bg-muted/10 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Brain className="w-4 h-4" />
        <span>Step-by-step reasoning</span>
      </div>
      
      {/* Render completed steps */}
      {completedSteps.map((step, index) => (
        <div key={`completed-${index}`} className="animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {index + 1}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="font-medium">{step.title}</div>
              <div className="text-sm text-muted-foreground">{step.description}</div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Render current streaming step */}
      {currentStep >= 0 && (
        <div className="">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-secondary text-secondary-foreground">
              {completedSteps.length + 1}
            </div>
            
            <div className="flex-1 space-y-1">
              {isStreamingTitle && (
                <div className="font-medium">
                  {streamingText}
                  <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-1" />
                </div>
              )}
              
              {!isStreamingTitle && (
                <div className="font-medium">{DEMO_STEPS[currentStep].title}</div>
              )}
              
              {!isStreamingTitle && isStreamingDescription && (
                <div className="text-sm text-muted-foreground">
                  {streamingText}
                  <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-1" />
                </div>
              )}
              
              {!isStreamingTitle && !isStreamingDescription && currentStep >= 0 && (
                <div className="text-sm text-muted-foreground">
                  {DEMO_STEPS[currentStep].description}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};
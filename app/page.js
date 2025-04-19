'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  // Core states
  const [step, setStep] = useState(-1); // Start at intro screen
  const [baselineSpoons, setBaselineSpoons] = useState(14); // Start with higher baseline
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [animateSpoon, setAnimateSpoon] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("optimal"); // optimal, stressed, or burnout

  // Questions specifically focus on "at your best" capacity
  const questions = [
    {
      id: 'optimalEnergy',
      question: 'When you\'re at your absolute best, how would you describe your energy levels?',
      options: [
        { value: 1, label: 'Good but still limited compared to others', spoonAdjustment: -1 },
        { value: 2, label: 'Strong and steady throughout the day', spoonAdjustment: 0 },
        { value: 3, label: 'Very high with bursts of hyperfocus/flow', spoonAdjustment: 1 },
        { value: 4, label: 'Exceptional - I can take on almost anything', spoonAdjustment: 2 },
      ]
    },
    {
      id: 'taskCapacity', 
      question: 'On your best days, how many demanding tasks can you complete?',
      options: [
        { value: 1, label: '2-3 tasks with breaks', spoonAdjustment: -1 },
        { value: 2, label: '4-6 tasks throughout the day', spoonAdjustment: 0 },
        { value: 3, label: '7-10 tasks with good momentum', spoonAdjustment: 1 },
        { value: 4, label: '10+ tasks with energy to spare', spoonAdjustment: 2 },
      ]
    },
    {
      id: 'socialCapacity',
      question: 'At your best, what\'s your social capacity?',
      options: [
        { value: 1, label: 'Small gatherings with trusted people', spoonAdjustment: -1 },
        { value: 2, label: 'Medium social events with recovery time', spoonAdjustment: 0 },
        { value: 3, label: 'Full day social events with short breaks', spoonAdjustment: 1 },
        { value: 4, label: 'Multiple days of socializing with minimal drain', spoonAdjustment: 2 },
      ]
    },
    {
      id: 'recoveryTime',
      question: 'When fully rested, how quickly do you bounce back from exertion?',
      options: [
        { value: 1, label: 'Need a full day to recover from demanding days', spoonAdjustment: -1 },
        { value: 2, label: 'Need a good night\'s sleep to recharge', spoonAdjustment: 0 },
        { value: 3, label: 'Can recover with short breaks throughout the day', spoonAdjustment: 1 },
        { value: 4, label: 'Quick to recover, rarely feel fully depleted', spoonAdjustment: 2 },
      ]
    },
    {
      id: 'adaptability',
      question: 'How adaptable are you when you\'re at your best?',
      subtext: '(handling changes, transitions, or unexpected events)',
      options: [
        { value: 1, label: 'Need structure but can handle some change', spoonAdjustment: -1 },
        { value: 2, label: 'Adapt well with a little preparation', spoonAdjustment: 0 },
        { value: 3, label: 'Handle most changes smoothly', spoonAdjustment: 1 },
        { value: 4, label: 'Thrive with variety and new challenges', spoonAdjustment: 2 },
      ]
    }
  ];

  // Current status modifiers
  const statusModifiers = {
    optimal: { 
      spoonAdjustment: 0, 
      description: "You're at your full capacity" 
    },
    stressed: { 
      spoonAdjustment: -3, 
      description: "You're experiencing high stress" 
    },
    burnout: { 
      spoonAdjustment: -6, 
      description: "You're in burnout or recovery" 
    }
  };

  // Calculate spoons based on answers
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      // Start with default baseline
      let calculatedSpoons = 14;
      
      // Add adjustments from answers
      Object.keys(answers).forEach(questionId => {
        const question = questions.find(q => q.id === questionId);
        if (question) {
          const selectedOption = question.options.find(opt => opt.value === answers[questionId]);
          if (selectedOption) {
            calculatedSpoons += selectedOption.spoonAdjustment;
          }
        }
      });
      
      // Ensure spoons stay within reasonable limits (12-20)
      calculatedSpoons = Math.max(12, Math.min(20, calculatedSpoons));
      
      setBaselineSpoons(calculatedSpoons);
    }
  }, [answers]);

  // Start the quiz
  const startQuiz = () => {
    setStep(0);
  };

  // Handle answer selection
  const handleAnswer = (questionId, value) => {
    setAnimateSpoon(true);
    setTimeout(() => setAnimateSpoon(false), 600);
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Progress to next question or show results
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  // Handle going back to previous question
  const goBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
      setShowResults(false);
    } else if (step === 0) {
      setStep(-1); // Go back to intro
    }
  };

  // Skip the current question
  const skipQuestion = () => {
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  // Reset the quiz
  const resetQuiz = () => {
    setStep(-1);
    setAnswers({});
    setShowResults(false);
    setBaselineSpoons(14);
  };

  // Manually adjust spoons
  const adjustSpoons = (amount) => {
    setBaselineSpoons(prev => {
      const newValue = prev + amount;
      return Math.max(12, Math.min(20, newValue));
    });
    setAnimateSpoon(true);
    setTimeout(() => setAnimateSpoon(false), 600);
  };

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  // Update current status
  const updateStatus = (status) => {
    setCurrentStatus(status);
  };

  // Get emoji for question
  const getQuestionEmoji = (questionId) => {
    switch(questionId) {
      case 'optimalEnergy': return '⚡';
      case 'taskCapacity': return '📝';
      case 'socialCapacity': return '👥';
      case 'recoveryTime': return '🔄';
      case 'adaptability': return '🔄';
      default: return '❓';
    }
  };

  // Calculate adjusted spoons based on current status
  const getCurrentSpoons = () => {
    const statusAdjustment = statusModifiers[currentStatus].spoonAdjustment;
    return Math.max(9, baselineSpoons + statusAdjustment);
  };

  // Determine color based on energy level
  const getEnergyColor = (energyPercentage) => {
    if (highContrast) {
      // High contrast colors
      if (energyPercentage >= 75) return '#000000'; // Black for high energy
      if (energyPercentage >= 50) return '#444444'; // Dark gray for medium energy
      if (energyPercentage >= 25) return '#666666'; // Medium gray for low energy
      if (energyPercentage >= 10) return '#888888'; // Light gray for critical energy
      return '#aaaaaa'; // Very light gray for depleted
    } else {
      // Regular colors
      if (energyPercentage >= 75) return '#4CAF50'; // Green for high energy
      if (energyPercentage >= 50) return '#FFEB3B'; // Yellow for medium energy
      if (energyPercentage >= 25) return '#FF9800'; // Orange for low energy
      if (energyPercentage >= 10) return '#F44336'; // Red for critical energy
      return '#9C27B0'; // Purple for depleted
    }
  };

  // Calculate energy percentage (100% for baseline view)
  const energyPercentage = 100;

  // Progress indicator
  const progressPercent = step >= 0 ? ((step + 1) / questions.length) * 100 : 0;

  return (
    <div className={`p-4 min-h-screen ${highContrast ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Spoons Baseline Calculator</h1>
        <p className="text-sm opacity-70">For AuDHD Energy Management</p>
      </header>

      {/* Intro Screen */}
      {step === -1 && (
        <div className="max-w-md mx-auto">
          <div className={`rounded-lg p-6 mb-6 ${highContrast ? 'bg-gray-100' : 'bg-gray-800'}`}>
            <div className="text-center mb-6 text-5xl">
              🥄 ⚡
            </div>
            
            <h2 className="text-xl font-bold mb-4 text-center">
              Calculate Your Maximum Spoon Capacity
            </h2>
            
            <p className="mb-4">
              This calculator helps you find your <strong>maximum energy capacity</strong> when you're at your absolute best - fully rested, low stress, and in optimal conditions.
            </p>
            
            <p className="mb-4">
              Think about your very best days when answering these questions. This will establish your baseline for when you're at 100%.
            </p>
            
            <p className="mb-6">
              The result will give you the number to set as your "Maximum Spoons" in your Garmin app.
            </p>
            
            <button 
              onClick={startQuiz} 
              className={`w-full py-3 px-4 rounded-md text-lg font-medium ${
                highContrast 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Start Assessment
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {step >= 0 && !showResults && (
        <div className="w-full bg-gray-700 h-4 rounded-full mb-6">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ease-out ${highContrast ? 'bg-black' : 'bg-blue-500'}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
          <div className="text-center text-xs mt-1">Question {step + 1} of {questions.length}</div>
        </div>
      )}

      {/* Questionnaire Section */}
      {step >= 0 && !showResults && (
        <div className="mb-8">
          <div className={`rounded-lg p-5 shadow-lg ${highContrast ? 'bg-gray-100' : 'bg-gray-800'}`}>
            <div className="text-center mb-4 text-4xl">
              {getQuestionEmoji(questions[step].id)}
            </div>
            
            <h2 className="text-xl mb-2 font-medium text-center">
              {questions[step].question}
            </h2>
            
            {questions[step].subtext && (
              <p className="text-sm opacity-70 text-center mb-4">{questions[step].subtext}</p>
            )}
            
            <div className="space-y-3 mt-4">
              {questions[step].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(questions[step].id, option.value)}
                  className={`w-full p-4 text-left rounded-md transition-all ${
                    highContrast 
                      ? 'bg-gray-200 hover:bg-gray-300 text-black border border-gray-400' 
                      : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between mt-6">
              <button 
                onClick={goBack} 
                className={`px-4 py-2 rounded-md ${
                  highContrast 
                    ? 'bg-gray-300 text-black hover:bg-gray-400' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                ← Back
              </button>
              
              <button 
                onClick={skipQuestion} 
                className={`px-4 py-2 rounded-md ${
                  highContrast 
                    ? 'bg-gray-300 text-black hover:bg-gray-400' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Skip →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {showResults && (
        <div className="max-w-md mx-auto">
          <div className={`rounded-lg p-6 mb-6 text-center ${highContrast ? 'bg-gray-100' : 'bg-gray-800'}`}>
            <h2 className="text-xl font-bold mb-2">Your Maximum Spoon Capacity</h2>
            
            {/* Spoon display with animation */}
            <div className={`text-7xl font-bold my-6 transition-all ${animateSpoon ? 'scale-125' : 'scale-100'}`}>
              {baselineSpoons}
            </div>
            
            {/* Spoon visualization */}
            <div className="flex justify-center flex-wrap gap-2 mb-4">
              {[...Array(baselineSpoons)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${
                    highContrast ? 'bg-black text-white' : 'bg-blue-500'
                  }`}
                >
                  🥄
                </div>
              ))}
            </div>
            
            {/* Energy bar */}
            <div className="mt-6 mb-8">
              <div className={`w-full h-6 ${highContrast ? 'bg-gray-300' : 'bg-gray-700'} rounded-full mb-1`}>
                <div 
                  className="h-6 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${energyPercentage}%`, 
                    backgroundColor: getEnergyColor(energyPercentage)
                  }}
                ></div>
              </div>
              <div className="text-sm opacity-70">Full Energy Capacity</div>
            </div>
            
            <p className="mb-4">This is your <strong>maximum spoon capacity</strong> when you're at your best.</p>
            
            {/* Manual adjustment */}
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button 
                onClick={() => adjustSpoons(-1)}
                className={`px-5 py-3 rounded-full font-bold text-xl ${
                  highContrast 
                    ? 'bg-gray-300 text-black hover:bg-gray-400' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                -
              </button>
              <div className="text-xl font-medium">Adjust</div>
              <button 
                onClick={() => adjustSpoons(1)}
                className={`px-5 py-3 rounded-full font-bold text-xl ${
                  highContrast 
                    ? 'bg-gray-300 text-black hover:bg-gray-400' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Current Status Section */}
          <div className={`rounded-lg p-6 mb-6 ${highContrast ? 'bg-gray-100' : 'bg-gray-800'}`}>
            <h3 className="text-lg font-bold mb-3">Current Energy Status</h3>
            <p className="mb-4">
              Your maximum is {baselineSpoons} spoons, but your current capacity might be different based on your state:
            </p>
            
            <div className="space-y-3 mb-4">
              <button
                onClick={() => updateStatus("optimal")}
                className={`w-full p-3 rounded-md text-left transition-all flex justify-between items-center ${
                  currentStatus === "optimal" 
                    ? (highContrast ? 'bg-black text-white' : 'bg-blue-600') 
                    : (highContrast ? 'bg-gray-200 text-black' : 'bg-gray-700')
                }`}
              >
                <span>Optimal (100%)</span>
                <span>{baselineSpoons} spoons</span>
              </button>
              
              <button
                onClick={() => updateStatus("stressed")}
                className={`w-full p-3 rounded-md text-left transition-all flex justify-between items-center ${
                  currentStatus === "stressed" 
                    ? (highContrast ? 'bg-black text-white' : 'bg-blue-600') 
                    : (highContrast ? 'bg-gray-200 text-black' : 'bg-gray-700')
                }`}
              >
                <span>High Stress (75%)</span>
                <span>{Math.max(9, baselineSpoons + statusModifiers.stressed.spoonAdjustment)} spoons</span>
              </button>
              
              <button
                onClick={() => updateStatus("burnout")}
                className={`w-full p-3 rounded-md text-left transition-all flex justify-between items-center ${
                  currentStatus === "burnout" 
                    ? (highContrast ? 'bg-black text-white' : 'bg-blue-600') 
                    : (highContrast ? 'bg-gray-200 text-black' : 'bg-gray-700')
                }`}
              >
                <span>Burnout/Recovery (50%)</span>
                <span>{Math.max(9, baselineSpoons + statusModifiers.burnout.spoonAdjustment)} spoons</span>
              </button>
            </div>
            
            <div className="mt-4 p-3 border rounded-md border-gray-600">
              <p className="text-center font-medium mb-2">Current Capacity: {getCurrentSpoons()} spoons</p>
              <p className="text-sm opacity-80 text-center">
                {statusModifiers[currentStatus].description}
              </p>
            </div>
          </div>
          
          {/* What does this mean? */}
          <div className={`rounded-lg p-6 mb-6 ${highContrast ? 'bg-gray-100' : 'bg-gray-800'}`}>
            <h3 className="text-lg font-bold mb-3">For Your Garmin App</h3>
            <p className="mb-3">
              • Set <strong>{baselineSpoons}</strong> as your "Maximum Spoons" in the Garmin app settings
            </p>
            <p className="mb-3">
              • The Garmin app will show your daily energy as a percentage of this maximum
            </p>
            <p>
              • Remember that this is your <strong>optimal capacity</strong> - during burnout or high stress periods, you'll have fewer spoons available
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <button 
              onClick={resetQuiz} 
              className={`py-3 px-4 rounded-md ${
                highContrast 
                  ? 'bg-gray-300 text-black hover:bg-gray-400' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Retake Assessment
            </button>
          </div>
        </div>
      )}

      {/* Footer with accessibility toggle */}
      <footer className="mt-8 pt-4 border-t border-gray-700 flex justify-between items-center">
        <div className="text-xs opacity-50">
          Spoons Theory Calculator for AuDHD
        </div>
        <button 
          onClick={toggleHighContrast}
          className={`text-sm px-4 py-2 rounded-lg ${
            highContrast 
              ? 'bg-black text-white' 
              : 'bg-gray-700 text-white'
          }`}
        >
          {highContrast ? 'Standard Mode' : 'High Contrast'}
        </button>
      </footer>
    </div>
  );
}
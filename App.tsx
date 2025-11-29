import React, { useState, useMemo } from 'react';
import { AppStage, PatientProfile, AssessmentReport } from './types';
import IntakeForm from './components/IntakeForm';
import InterviewSession from './components/InterviewSession';
import MedicalReport from './components/MedicalReport';
import { GeminiMedicalService } from './services/geminiService';
import { Stethoscope, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INTAKE);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [report, setReport] = useState<AssessmentReport | null>(null);

  // Initialize service once
  const service = useMemo(() => new GeminiMedicalService(), []);

  const handleIntakeSubmit = (profile: PatientProfile) => {
    setPatientProfile(profile);
    setStage(AppStage.INTERVIEW);
  };

  const handleInterviewComplete = async () => {
    setStage(AppStage.ANALYZING);
    try {
      const result = await service.generateReport();
      setReport(result);
      setStage(AppStage.REPORT);
    } catch (error) {
      console.error("Failed to generate report", error);
      alert("Something went wrong generating the diagnosis. Please try again.");
      setStage(AppStage.INTAKE); // Reset on critical failure
    }
  };

  const handleReset = () => {
    setPatientProfile(null);
    setReport(null);
    setStage(AppStage.INTAKE);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
               <Stethoscope size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">MediTriage<span className="text-blue-600">AI</span></span>
          </div>
          <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Research Preview • Not Medical Advice
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {stage === AppStage.INTAKE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="mb-8 text-center max-w-2xl">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">AI-Powered Symptom Assessment</h1>
              <p className="text-lg text-slate-600">
                Begin by entering your details. Our AI doctor will conduct a brief interview to understand your condition and provide a preliminary differential diagnosis.
              </p>
            </div>
            <IntakeForm onSubmit={handleIntakeSubmit} />
          </div>
        )}

        {stage === AppStage.INTERVIEW && patientProfile && (
           <div className="flex flex-col items-center gap-6 animate-fade-in">
              <InterviewSession 
                profile={patientProfile} 
                service={service} 
                onComplete={handleInterviewComplete} 
              />
           </div>
        )}

        {stage === AppStage.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 relative">
              <Loader2 className="w-10 h-10 animate-spin" />
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-25"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Symptoms...</h2>
            <p className="text-slate-500">Cross-referencing medical database and generating report.</p>
          </div>
        )}

        {stage === AppStage.REPORT && report && patientProfile && (
          <MedicalReport 
            report={report} 
            profile={patientProfile} 
            onReset={handleReset} 
          />
        )}

      </main>
    </div>
  );
};

export default App;

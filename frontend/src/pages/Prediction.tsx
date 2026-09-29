import { useState, useEffect } from 'react';
import { predictRisk, getFeatureMetadata } from '../services/api';
import { Activity, ShieldCheck, AlertTriangle, Info, ClipboardList, BarChart2, ShieldAlert, RefreshCcw, ArrowRight, Settings, AlertCircle, HeartPulse, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';
import HeartModelVisualization from '../components/HeartModel';

export default function Prediction() {
  const initialState = {
    age: 55, sex: 1, cp: 2, trestbps: 130, chol: 240, fbs: 0, 
    restecg: 1, thalach: 150, exang: 0, oldpeak: 1.0, slope: 2, ca: 0, thal: 3
  };

  const [formData, setFormData] = useState(initialState);
  const [metadata, setMetadata] = useState<any>(null);
  const [validationWarnings, setValidationWarnings] = useState<any[]>([]);
  const [showWarnings, setShowWarnings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFeatureMetadata().then(res => setMetadata(res.data)).catch(console.error);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
    setShowWarnings(false);
  };

  const handleClear = () => {
    setFormData(initialState);
    setResult(null);
    setShowWarnings(false);
    setValidationWarnings([]);
  };

  const fieldLabels: Record<string, string> = {
    age: "Age", sex: "Sex", cp: "Chest Pain Type", trestbps: "Resting Blood Pressure",
    chol: "Cholesterol", fbs: "Fasting Blood Sugar", restecg: "Resting ECG",
    thalach: "Maximum Heart Rate", exang: "Exercise-Induced Angina", oldpeak: "ST Depression",
    slope: "Slope of Peak Exercise", ca: "Major Vessels", thal: "Thalassemia"
  };

  const handleSubmit = async (e: any, overrideWarning = false) => {
    if (e) e.preventDefault();
    setLoading(true); setError(null); setValidationWarnings([]);
    
    try {
      if (metadata && !overrideWarning) {
        let warnings: any[] = [];
        for (const key of Object.keys(formData)) {
          if (metadata[key] && metadata[key].min !== undefined && metadata[key].max !== undefined) {
            const val = formData[key as keyof typeof formData];
            if (val < metadata[key].min || val > metadata[key].max) {
               warnings.push({ field: key, entered: val, min: metadata[key].min, max: metadata[key].max });
            }
          }
        }
        if (warnings.length > 0) {
           setValidationWarnings(warnings); setShowWarnings(true); setLoading(false);
           return;
        }
      }
      setShowWarnings(false);
      const res = await predictRisk(formData);
      setResult({ ...res.data, inputSnapshot: { ...formData } });
    } catch (err) {
      console.error(err);
      setError("Backend connection unavailable. Please ensure the FastAPI server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Background ECG Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-40 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(ellipse at center, #E8B56A 0%, transparent 70%)' }}>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-textMain mb-2 flex items-center">
            <HeartPulse className="w-8 h-8 mr-3 text-brand-coralMain" />
            Patient Risk <span className="text-brand-coralMain ml-2 border-b-2 border-brand-coralMain">Prediction</span>
          </h1>
          <p className="text-brand-textSecondary text-sm">AI-powered analysis using trained SVM model to assess heart disease risk</p>
        </div>
        
        {/* Workflow Indicator */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-brand-textMuted bg-brand-secondaryBg px-4 py-2 rounded-full border border-brand-border">
          <span className="text-brand-coralMain">01 Patient Data</span> <ArrowRight className="w-3 h-3" />
          <span>02 Validation</span> <ArrowRight className="w-3 h-3" />
          <span>03 SVM Analysis</span> <ArrowRight className="w-3 h-3" />
          <span>04 Explanation</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* LEFT PANEL */}
        <div>
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-brand-elevated border border-brand-border flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-brand-coralMain" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-brand-textMain leading-tight">Clinical Inputs</h2>
                  <p className="text-xs text-brand-textMuted">Enter the patient's clinical and cardiac measurements</p>
                </div>
              </div>
              <button type="button" onClick={handleClear} className="text-xs flex items-center text-brand-textMuted hover:text-brand-textMain transition-colors">
                <RefreshCcw className="w-3 h-3 mr-1" /> Clear All
              </button>
            </div>
            
            {/* Section 1: Profile */}
            <div className="space-y-4">
              <h3 className="flex items-center text-sm font-semibold text-brand-textMain">
                <span className="w-5 h-5 rounded-full bg-brand-coralMain/20 text-brand-coralMain flex items-center justify-center text-[10px] mr-2">1</span>
                Patient Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Age (years)</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Sex</label>
                  <select name="sex" value={formData.sex} onChange={handleChange} className="input-field">
                    <option value={1}>Male</option>
                    <option value={0}>Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Symptoms */}
            <div className="space-y-4 pt-2">
              <h3 className="flex items-center text-sm font-semibold text-brand-textMain">
                <span className="w-5 h-5 rounded-full bg-brand-coralMain/20 text-brand-coralMain flex items-center justify-center text-[10px] mr-2">2</span>
                Symptoms & Clinical History
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Chest Pain Type</label>
                  <select name="cp" value={formData.cp} onChange={handleChange} className="input-field">
                    <option value={1}>Typical Angina</option>
                    <option value={2}>Atypical Angina</option>
                    <option value={3}>Non-anginal Pain</option>
                    <option value={4}>Asymptomatic</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Exercise-Induced Angina</label>
                  <select name="exang" value={formData.exang} onChange={handleChange} className="input-field">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Vitals */}
            <div className="space-y-4 pt-2">
              <h3 className="flex items-center text-sm font-semibold text-brand-textMain">
                <span className="w-5 h-5 rounded-full bg-brand-coralMain/20 text-brand-coralMain flex items-center justify-center text-[10px] mr-2">3</span>
                Vital Signs & Laboratory Measurements
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Resting Blood Pressure <span className="text-brand-textMuted">(mm Hg)</span></label>
                  <input type="number" name="trestbps" value={formData.trestbps} onChange={handleChange} className="input-field" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Cholesterol <span className="text-brand-textMuted">(mg/dl)</span></label>
                  <input type="number" name="chol" value={formData.chol} onChange={handleChange} className="input-field" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Maximum Heart Rate <span className="text-brand-textMuted">(bpm)</span></label>
                  <input type="number" name="thalach" value={formData.thalach} onChange={handleChange} className="input-field" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Fasting Blood Sugar &gt; 120 mg/dl</label>
                  <select name="fbs" value={formData.fbs} onChange={handleChange} className="input-field">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: ECG */}
            <div className="space-y-4 pt-2">
              <h3 className="flex items-center text-sm font-semibold text-brand-textMain">
                <span className="w-5 h-5 rounded-full bg-brand-coralMain/20 text-brand-coralMain flex items-center justify-center text-[10px] mr-2">4</span>
                ECG & Other Indicators
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Resting ECG</label>
                  <select name="restecg" value={formData.restecg} onChange={handleChange} className="input-field">
                    <option value={0}>Normal</option>
                    <option value={1}>ST-T Wave Abnormality</option>
                    <option value={2}>Left Ventricular Hypertrophy</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">ST Depression <span className="text-brand-textMuted">(oldpeak)</span></label>
                  <input type="number" step="0.1" name="oldpeak" value={formData.oldpeak} onChange={handleChange} className="input-field" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Number of Major Vessels <span className="text-brand-textMuted">(0-3)</span></label>
                  <input type="number" min="0" max="3" name="ca" value={formData.ca} onChange={handleChange} className="input-field" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-brand-textSecondary">Slope of Peak Exercise ST</label>
                  <select name="slope" value={formData.slope} onChange={handleChange} className="input-field">
                    <option value={1}>Upsloping</option>
                    <option value={2}>Flat</option>
                    <option value={3}>Downsloping</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-medium text-brand-textSecondary">Thalassemia Result</label>
                  <select name="thal" value={formData.thal} onChange={handleChange} className="input-field">
                    <option value={3}>Normal</option>
                    <option value={6}>Fixed Defect</option>
                    <option value={7}>Reversable Defect</option>
                  </select>
                </div>
              </div>
            </div>

            {showWarnings && (
              <div className="p-5 bg-[#3B250D] border border-[#D99A4A]/30 rounded-xl space-y-3">
                <div className="flex items-center text-[#F2C982] font-semibold text-sm">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  INPUT VALIDATION WARNING
                </div>
                <p className="text-xs text-[#E8B56A]/80 leading-relaxed">
                  One or more values fall outside the observed training-data range. Verify the entered measurements before interpreting the model output.
                </p>
                <ul className="space-y-2 mt-3">
                  {validationWarnings.map((w, idx) => (
                    <li key={idx} className="text-xs text-brand-textMain bg-black/30 p-2.5 rounded-lg border border-black/20">
                      <span className="font-semibold">{fieldLabels[w.field] || w.field}</span> — 
                      Entered: <span className="text-[#F2C982] font-mono ml-1">{w.entered}</span> <br/>
                      <span className="text-[10px] text-brand-textMuted mt-1 block">Observed training range: {w.min} – {w.max}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 flex justify-end">
                   <button 
                     type="button" 
                     onClick={() => handleSubmit(null, true)}
                     className="px-4 py-2 bg-[#D99A4A]/20 text-[#F2C982] text-xs font-semibold rounded-lg hover:bg-[#D99A4A]/30 transition-colors"
                   >
                     Proceed with Inference Anyway
                   </button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full bg-[#F07C73] hover:bg-[#FFB0A8] text-[#07111F] font-bold py-4 rounded-xl flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(240,124,115,0.3)]">
                {loading ? <Activity className="w-5 h-5 mr-2 animate-spin text-[#07111F]" /> : <Activity className="w-5 h-5 mr-2 text-[#07111F]" />}
                Analyze Heart Risk <ArrowRight className="w-5 h-5 ml-2 text-[#07111F]" />
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Top Result Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Probability Circular Gauge */}
                <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="w-full flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-brand-textMain">Prediction Result</h3>
                      <p className="text-[10px] text-brand-textMuted max-w-[140px] leading-tight mt-0.5">Model inference using trained SVM</p>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-brand-elevated border border-brand-border px-2.5 py-1 rounded-full shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-coralMain animate-pulse"></div>
                      <span className="text-[9px] font-medium text-brand-coralMain uppercase">Live</span>
                    </div>
                  </div>
                  
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Dark Navy Base Ring */}
                    <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#101D2D" strokeWidth="8" className="drop-shadow-lg" />
                      {/* Coral Progress Ring */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#F07C73" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * result.probability_disease)} className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(240,124,115,0.3)]" strokeLinecap="round" />
                    </svg>
                    <div className="text-center z-10 flex flex-col items-center">
                      <HeartPulse className="w-6 h-6 text-brand-coralMain mb-1" />
                      <span className="text-3xl font-bold text-brand-textMain">{(result.probability_disease * 100).toFixed(1)}%</span>
                      <span className="text-[10px] text-brand-textSecondary mt-1 flex items-center">
                        Model-estimated probability
                        <div className="group relative ml-1">
                          <Info className="w-3 h-3 text-brand-textMuted cursor-help" />
                          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-brand-elevated border border-brand-border text-[10px] text-brand-textSecondary rounded-lg shadow-xl z-20 text-center pointer-events-none">
                            Probability and confidence are outputs of the trained machine-learning model and are not clinically validated probabilities.
                          </div>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Confidence */}
                <div className="space-y-6 flex flex-col justify-between">
                  <div className={clsx(
                    "glass-card p-6 h-full flex flex-col justify-center border-l-4",
                    result.predicted_class === 1 ? "border-l-brand-coralMain bg-brand-coralMain/5" : "border-l-brand-border"
                  )}>
                    <div className="flex items-start space-x-4">
                      <div className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                        result.predicted_class === 1 ? "bg-brand-coralMain/20 text-brand-coralLight" : "bg-brand-elevated border border-brand-border text-brand-textMuted"
                      )}>
                        {result.predicted_class === 1 ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className={clsx(
                          "text-xl font-bold leading-tight mb-2",
                          result.predicted_class === 1 ? "text-brand-coralLight" : "text-brand-textMain"
                        )}>
                          {result.prediction}
                        </h3>
                        <p className="text-xs text-brand-textSecondary leading-relaxed">
                          The model classified this record as {result.predicted_class === 1 ? 'high risk' : 'low risk'} for heart disease.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-5">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <h4 className="text-xs font-semibold text-brand-textSecondary mb-0.5">Model Confidence</h4>
                        <span className="text-lg font-bold text-brand-textMain">{result.model_confidence}</span>
                      </div>
                      <BarChart2 className="w-5 h-5 text-brand-coralMain" />
                    </div>
                    {/* Confidence Bars */}
                    <div className="flex space-x-1.5 h-3">
                      <div className={clsx("flex-1 rounded-sm", result.model_confidence === 'High' ? "bg-brand-coralMain" : "bg-brand-coralMain/70")} />
                      <div className={clsx("flex-1 rounded-sm", result.model_confidence === 'High' || result.model_confidence === 'Moderate' ? "bg-brand-coralMain/80" : "bg-brand-elevated border border-brand-border")} />
                      <div className={clsx("flex-1 rounded-sm", result.model_confidence === 'High' ? "bg-brand-coralMain/60" : "bg-brand-elevated border border-brand-border")} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Model-Influencing Factors */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-brand-textMain flex items-center">
                      <BrainCircuit className="w-4 h-4 mr-2 text-brand-coralMain" /> Model-Influencing Factors
                    </h3>
                    <p className="text-[10px] text-brand-textMuted mt-0.5">Top 5 features ordered by relative importance score</p>
                  </div>
                </div>
                <div className="mb-4 text-[9px] text-[#D99A4A]/80 italic border-l-2 border-[#D99A4A]/50 pl-2 bg-[#D99A4A]/5 py-1">
                  Feature importance represents model-level influence and does not indicate direct medical causation.
                </div>

                <div className="space-y-4">
                  {result.top_factors.map((factor: any, i: number) => {
                    const influenceVal = parseFloat(factor.relative_influence);
                    const isHigher = factor.direction.includes("Higher");
                    return (
                      <div key={i} className="flex items-center text-sm">
                        <div className="w-6 h-6 rounded-full bg-brand-elevated border border-brand-border flex items-center justify-center text-[10px] font-bold text-brand-textSecondary shrink-0 mr-3">
                          {i + 1}
                        </div>
                        <div className="w-32 truncate text-brand-textMain text-xs font-medium mr-4">
                          {fieldLabels[factor.name] || factor.name}
                        </div>
                        <div className="flex-1 flex items-center">
                          <div className="w-full bg-brand-elevated h-2.5 rounded-full overflow-hidden mr-3">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-brand-coralMain to-brand-coralLight" 
                              style={{ width: `${influenceVal}%`, opacity: 1 - (i * 0.15) }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-brand-textSecondary w-12 text-right mr-4">{factor.relative_influence}</span>
                          <span className={clsx(
                            "text-[9px] uppercase tracking-wider px-2 py-1 rounded w-20 text-center font-semibold",
                            isHigher ? "bg-[#D99A4A]/20 text-[#E8B56A]" : "bg-brand-border/50 text-brand-textMuted"
                          )}>
                            {isHigher ? 'Higher Risk' : 'Lower Risk'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3 Bottom Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-brand-secondaryBg border border-brand-border p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center text-brand-textMain text-xs font-semibold mb-3">
                    <ClipboardList className="w-4 h-4 mr-2 text-brand-coralMain" /> Patient Summary
                  </div>
                  <div className="text-[10px] text-brand-textMuted leading-relaxed space-y-1">
                    <p><span className="text-brand-textSecondary">Age/Sex:</span> {result.inputSnapshot.age}y, {result.inputSnapshot.sex === 1 ? 'M' : 'F'}</p>
                    <p><span className="text-brand-textSecondary">CP/ExAng:</span> {result.inputSnapshot.cp}, {result.inputSnapshot.exang === 1 ? 'Yes' : 'No'}</p>
                    <p><span className="text-brand-textSecondary">BP/Chol:</span> {result.inputSnapshot.trestbps}, {result.inputSnapshot.chol}</p>
                  </div>
                </div>

                <div className="bg-brand-secondaryBg border border-brand-border p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center text-brand-textMain text-xs font-semibold mb-3">
                    <Settings className="w-4 h-4 mr-2 text-brand-coralMain" /> Model Information
                  </div>
                  <div className="text-[10px] text-brand-textMuted leading-relaxed space-y-1">
                    <p><span className="text-brand-textSecondary">Algorithm:</span> SVM (SVC)</p>
                    <p><span className="text-brand-textSecondary">Kernel:</span> Radial Basis Function</p>
                    <p><span className="text-brand-textSecondary">Features:</span> 13 Clinical Inputs</p>
                  </div>
                </div>

                <div className="bg-brand-secondaryBg border border-brand-border p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#D99A4A]/10 rounded-bl-full"></div>
                  <div className="flex items-center text-brand-textMain text-xs font-semibold mb-2 relative z-10">
                    <AlertCircle className="w-4 h-4 mr-2 text-[#D99A4A]" /> Important Note
                  </div>
                  <p className="text-[10px] text-brand-textSecondary leading-relaxed relative z-10 italic">
                    This is a machine-learning decision-support prototype and not a substitute for professional medical diagnosis.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card h-full flex flex-col items-center justify-center text-center p-10 relative overflow-hidden" style={{ minHeight: 'calc(100% - 2rem)' }}>
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-coralMain/5 rounded-bl-[100%] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-coralMain/5 rounded-tr-[100%] pointer-events-none"></div>

              <div className="flex flex-col items-center z-10">
                <div className="mb-8 p-1 px-3 rounded-full bg-brand-elevated border border-brand-border inline-flex items-center">
                  <div className="w-2 h-2 rounded-full bg-brand-coralMain mr-2 animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-coralMain font-semibold">HEART RISK ANALYSIS</span>
                </div>

                <div className="w-full h-64 mb-2 relative z-10 mx-auto">
                  <HeartModelVisualization scale={1.8} />
                </div>
                
                <h3 className="text-3xl font-bold text-brand-textMain mb-4">Ready for Analysis</h3>
                
                <p className="text-sm text-brand-textSecondary max-w-[320px] leading-relaxed mb-10">
                  Enter the clinical measurements and run the trained SVM model to generate a heart-risk assessment.
                </p>

                <div className="flex items-center space-x-2 bg-brand-secondaryBg border border-brand-border px-4 py-2 rounded-lg">
                  <Activity className="w-4 h-4 text-brand-textMuted" />
                  <span className="text-xs text-brand-textMuted">Awaiting SVM Inference Request</span>
                </div>
              </div>

              {error && (
                <div className="mt-8 p-4 bg-[#3B250D] border border-[#D99A4A]/30 rounded-lg text-[#F2C982] text-xs flex items-center w-full max-w-sm mx-auto z-10">
                  <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

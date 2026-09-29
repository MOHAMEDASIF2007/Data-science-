import { useEffect, useState } from 'react';
import { getModelInfo, getEdaSummary } from '../services/api';
import { FileText, ShieldCheck, Database, Activity, CheckCircle, ChevronRight } from 'lucide-react';

export default function Documentation() {
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [edaSummary, setEdaSummary] = useState<any>(null);

  useEffect(() => {
    getModelInfo().then(res => setModelInfo(res.data)).catch(console.error);
    getEdaSummary().then(res => setEdaSummary(res.data)).catch(console.error);
  }, []);

  const metrics = modelInfo?.metrics || {};

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-brand-textMain mb-2 flex items-center">
          <FileText className="mr-3 w-8 h-8 text-brand-violetMain" />
          UYIRNADI Documentation
        </h1>
        <p className="text-xl text-brand-textSecondary">Heart Disease Risk Intelligence System</p>
      </div>

      <div className="glass-card p-8 border-l-4 border-l-brand-violetMain">
        <p className="text-brand-textMain leading-relaxed font-medium">
          UYIRNADI is a machine-learning decision-support prototype that analyzes clinical measurements and cardiac indicators using a Support Vector Machine to classify heart-disease risk.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* 00 Project Pipeline */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">00</span> Complete Project Pipeline
          </h2>
          <div className="bg-brand-secondaryBg p-6 rounded-xl border border-brand-border flex flex-col items-center">
            {[
              { title: 'Cleveland Dataset', desc: 'Raw Clinical Data' },
              { title: 'Data Cleaning', desc: 'Missing Values & Duplicates' },
              { title: 'EDA & Analytics', desc: '"What does our data look like?"' },
              { title: 'Feature Engineering', desc: 'Encoding & Scaling' },
              { title: 'SVM Training', desc: 'RBF Kernel Optimization' },
              { title: 'Model Evaluation', desc: 'Test Set Metrics' },
              { title: 'Feature Insights', desc: '"What does our model rely on?"' },
              { title: 'Patient Prediction', desc: 'Live Inference' }
            ].map((step, idx, arr) => (
              <div key={step.title} className="flex flex-col items-center">
                <div className="bg-brand-elevated border border-brand-violetMain/30 text-center px-6 py-3 rounded-lg shadow-lg min-w-[240px]">
                  <h3 className="text-sm font-bold text-brand-textMain">{step.title}</h3>
                  <p className="text-[10px] text-brand-violetMain mt-1 uppercase tracking-wider">{step.desc}</p>
                </div>
                {idx < arr.length - 1 && (
                  <div className="h-6 w-0.5 bg-gradient-to-b from-brand-violetMain/50 to-brand-border my-1 flex justify-center">
                    <ChevronRight className="w-4 h-4 text-brand-textMuted transform rotate-90 relative top-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 01 Challenge Overview */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">01</span> Challenge Overview
          </h2>
          <ul className="space-y-2 text-sm text-brand-textSecondary list-disc list-inside ml-2">
            <li>Heart Disease Risk Prediction</li>
            <li>Data-driven clinical decision support</li>
            <li>Explainable model output</li>
            <li>Jury evaluation using unseen records</li>
          </ul>
        </section>

        {/* 02 Dataset */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">02</span> Dataset
          </h2>
          <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
            <h3 className="text-brand-violetMain font-medium mb-3 flex items-center">
              <Database className="w-4 h-4 mr-2" /> Primary dataset: UCI Heart Disease — Cleveland dataset
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-brand-mainBg p-3 rounded-lg border border-brand-border/50">
                <div className="text-xs text-brand-textMuted uppercase">Records</div>
                <div className="text-lg font-bold text-brand-textMain">{edaSummary?.num_rows || 303}</div>
              </div>
              <div className="bg-brand-mainBg p-3 rounded-lg border border-brand-border/50">
                <div className="text-xs text-brand-textMuted uppercase">Features</div>
                <div className="text-lg font-bold text-brand-textMain">{edaSummary?.num_cols || 14}</div>
              </div>
              <div className="bg-brand-mainBg p-3 rounded-lg border border-brand-border/50">
                <div className="text-xs text-brand-textMuted uppercase">Missing Values</div>
                <div className="text-lg font-bold text-brand-textMain">{
                  (edaSummary?.missing_values 
                    ? Object.values(edaSummary.missing_values).reduce((a: any, b: any) => a + b, 0)
                    : 0) as number
                }</div>
              </div>
              <div className="bg-brand-mainBg p-3 rounded-lg border border-brand-border/50">
                <div className="text-xs text-brand-textMuted uppercase">Target Distribution</div>
                <div className="text-xs font-bold text-brand-textMain mt-1">
                  0: {edaSummary?.target_distribution?.['0'] || 164}<br />
                  1: {edaSummary?.target_distribution?.['1'] || 139}
                </div>
              </div>
            </div>
            <p className="text-xs text-brand-textSecondary mt-2">
              The dataset contains 13 input clinical features and 1 target variable.<br />
              Target: <code className="text-brand-violetMain bg-brand-violetMain/10 px-1 rounded">0 = No Heart Disease</code>, <code className="text-[#F2C982] bg-[#F2C982]/10 px-1 rounded">1 = Heart Disease Present</code>.
            </p>
          </div>
        </section>

        {/* 03 Data Preparation */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">03</span> Data Preparation
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Missing-value detection', 'Missing-value handling', 'Duplicate detection', 'Data validation', 'Outlier analysis', 'Categorical encoding', 'Numerical scaling'].map(step => (
              <div key={step} className="flex items-center text-sm text-brand-textSecondary bg-brand-elevated border border-brand-border px-3 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4 text-brand-amberDark mr-2 shrink-0" /> {step}
              </div>
            ))}
          </div>
        </section>

        {/* 04 Feature Engineering */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">04</span> Feature Engineering
          </h2>
          <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-brand-textMain mb-3 border-b border-brand-border/50 pb-2">Original Features (13)</h3>
              <p className="text-xs text-brand-textSecondary leading-relaxed font-mono">
                age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
              </p>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-brand-violetMain mb-3 border-b border-brand-border/50 pb-2">Engineered Features</h3>
              <p className="text-xs text-brand-textSecondary leading-relaxed">
                The preprocessing pipeline applies One-Hot Encoding to categorical variables (cp, restecg, slope, thal) and StandardScaler to numerical variables, expanding the final feature space evaluated by the model.
              </p>
            </div>
          </div>
        </section>

        {/* 05 SVM Model */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">05</span> SVM Model
          </h2>
          <div className="flex flex-wrap gap-4">
             <div className="glass-card px-4 py-3 min-w-[140px]">
               <div className="text-[10px] text-brand-textMuted uppercase">Algorithm</div>
               <div className="text-sm font-bold text-brand-textMain">SVM / SVC</div>
             </div>
             <div className="glass-card px-4 py-3 min-w-[140px]">
               <div className="text-[10px] text-brand-textMuted uppercase">Kernel</div>
               <div className="text-sm font-bold text-brand-textMain">RBF</div>
             </div>
             <div className="glass-card px-4 py-3 min-w-[140px]">
               <div className="text-[10px] text-brand-textMuted uppercase">Training split</div>
               <div className="text-sm font-bold text-brand-textMain">80%</div>
             </div>
             <div className="glass-card px-4 py-3 min-w-[140px]">
               <div className="text-[10px] text-brand-textMuted uppercase">Testing split</div>
               <div className="text-sm font-bold text-brand-textMain">20%</div>
             </div>
          </div>
          <p className="text-sm text-brand-textSecondary mt-2">
            Support Vector Machines (SVM) with a Radial Basis Function (RBF) kernel are highly effective at finding non-linear decision boundaries in high-dimensional clinical data, making them well-suited for this dataset's complex feature interactions.
          </p>
        </section>

        {/* 06 Model Evaluation */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">06</span> Model Evaluation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="glass-card p-4 text-center">
              <div className="text-[10px] text-brand-textMuted uppercase tracking-wider mb-1">Accuracy</div>
              <div className="text-xl font-bold text-brand-textMain">{metrics?.accuracy !== undefined ? (metrics.accuracy * 100).toFixed(1) + '%' : 'N/A'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-[10px] text-brand-textMuted uppercase tracking-wider mb-1">Precision</div>
              <div className="text-xl font-bold text-brand-textMain">{metrics?.precision !== undefined ? (metrics.precision * 100).toFixed(1) + '%' : 'N/A'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-[10px] text-brand-textMuted uppercase tracking-wider mb-1">Recall</div>
              <div className="text-xl font-bold text-brand-textMain">{metrics?.recall !== undefined ? (metrics.recall * 100).toFixed(1) + '%' : 'N/A'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-[10px] text-brand-textMuted uppercase tracking-wider mb-1">F1 Score</div>
              <div className="text-xl font-bold text-brand-textMain">{metrics?.f1_score !== undefined ? (metrics.f1_score * 100).toFixed(1) + '%' : 'N/A'}</div>
            </div>
            <div className="glass-card p-4 text-center border-b-2 border-brand-violetMain">
              <div className="text-[10px] text-brand-violetMain uppercase tracking-wider mb-1">ROC-AUC</div>
              <div className="text-xl font-bold text-brand-textMain">{metrics?.roc_auc !== undefined ? (metrics.roc_auc * 100).toFixed(1) + '%' : 'N/A'}</div>
            </div>
          </div>
          <p className="text-sm text-brand-textSecondary mt-2">
            The system exposes the real Confusion Matrix and ROC Curve based on the 20% unseen test evaluation dataset, viewable in the Model Intelligence section.
          </p>
        </section>

        {/* 07 Explainable AI */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">07</span> Explainable AI
          </h2>
          <div className="bg-brand-elevated border border-brand-border p-5 rounded-xl">
            <h3 className="text-sm font-semibold text-brand-textMain mb-2">Global Permutation Importance</h3>
            <p className="text-sm text-brand-textSecondary leading-relaxed mb-4">
              We utilize permutation importance to measure how the model's performance changes when a feature's values are randomly shuffled. This quantifies the model's reliance on specific features for its internal decision boundary.
            </p>
            <div className="p-3 bg-brand-violetMain/10 border border-brand-violetMain/30 rounded-lg flex items-start">
              <Activity className="w-5 h-5 text-brand-violetMain mr-3 shrink-0" />
              <p className="text-xs text-brand-violetLight">
                <strong>Important Note:</strong> Feature importance indicates model reliance and statistical associations learned during training. It does not establish direct medical causation.
              </p>
            </div>
          </div>
        </section>

        {/* 08 Prediction Workflow */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">08</span> Prediction Workflow
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 bg-brand-secondaryBg p-6 rounded-xl border border-brand-border">
            {['Patient Input', 'Validation', 'Preprocessing', 'Feature Engineering', 'SVM Inference', 'Probability', 'Model Explanation', 'Decision-Support Output'].map((step, idx, arr) => (
              <div key={step} className="flex items-center">
                <span className="text-[10px] sm:text-xs font-semibold text-brand-textMain bg-brand-elevated border border-brand-border px-3 py-1.5 rounded-full">{step}</span>
                {idx < arr.length - 1 && <ChevronRight className="w-4 h-4 mx-1 sm:mx-2 text-brand-textMuted" />}
              </div>
            ))}
          </div>
        </section>

        {/* 09 System Architecture */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">09</span> System Architecture
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 bg-brand-secondaryBg p-6 rounded-xl border border-brand-border">
            {['React Frontend', 'FastAPI', 'Preprocessing Pipeline', 'Saved SVM Model', 'Prediction / Explainability', 'JSON Response'].map((step, idx, arr) => (
              <div key={step} className="flex items-center flex-col sm:flex-row">
                <span className="text-xs font-semibold text-brand-violetMain bg-brand-violetMain/10 border border-brand-violetMain/20 px-4 py-2 rounded-lg">{step}</span>
                {idx < arr.length - 1 && <ChevronRight className="w-4 h-4 mx-2 my-1 sm:my-0 text-brand-textMuted transform rotate-90 sm:rotate-0" />}
              </div>
            ))}
          </div>
        </section>

        {/* 10 Jury Test Mode */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">10</span> Jury Test Mode
          </h2>
          <div className="glass-card p-6">
            <p className="text-sm text-brand-textSecondary mb-4">
              The jury can enter an unseen clinical record via the Risk Prediction interface. The system autonomously:
            </p>
            <ul className="space-y-2 text-sm text-brand-textSecondary list-disc list-inside mb-4 ml-2">
              <li>validates the inputs</li>
              <li>applies the same preprocessing pipeline</li>
              <li>runs the trained SVM</li>
              <li>generates prediction</li>
              <li>generates model-estimated probability</li>
              <li>displays model-influencing factors</li>
            </ul>
            <div className="inline-block px-4 py-2 bg-brand-mainBg border border-brand-border rounded font-mono text-xs text-brand-violetMain">
              No manual modification of jury data is performed.
            </div>
          </div>
        </section>

        {/* 11 Technology Stack */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-textMain flex items-center border-b border-brand-border pb-2">
            <span className="text-brand-violetMain font-mono mr-3">11</span> Technology Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {['React', 'TypeScript', 'Vite', 'FastAPI', 'Python', 'scikit-learn', 'pandas', 'numpy', 'joblib', 'Recharts'].map(tech => (
              <span key={tech} className="px-3 py-1 bg-brand-elevated border border-brand-border rounded-full text-xs text-brand-textSecondary">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* 12 Medical Disclaimer */}
        <section className="pt-8">
          <div className="bg-brand-violetMain/10 border border-brand-violetMain/50 p-6 rounded-xl text-center shadow-lg">
            <ShieldCheck className="w-12 h-12 text-brand-violetMain mx-auto mb-4" />
            <p className="text-sm text-brand-violetLight font-semibold tracking-wide uppercase">
              UYIRNADI is a machine-learning decision-support prototype and is not a substitute for professional medical diagnosis.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

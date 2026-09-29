import { useEffect, useState } from 'react';
import { getModelInfo, getMetrics, getEdaSummary } from '../services/api';
import { Activity, Database, Users, CheckCircle, Percent, AlertCircle } from 'lucide-react';
import HeartModelVisualization from '../components/HeartModel';

export default function Dashboard() {
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [eda, setEda] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getModelInfo().catch(() => ({ data: null })),
      getMetrics().catch(() => ({ data: null })),
      getEdaSummary().catch(() => ({ data: null }))
    ]).then(([infoRes, metricsRes, edaRes]) => {
      if (infoRes.data) setModelInfo(infoRes.data);
      if (metricsRes.data) setMetrics(metricsRes.data);
      if (edaRes.data) setEda(edaRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-brand-amberMain text-center py-20 flex justify-center items-center"><Activity className="animate-spin w-8 h-8 mr-3"/> Loading intelligence...</div>;

  const isBackendDown = !eda || !modelInfo || !metrics;

  if (isBackendDown) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-[#D99A4A] mb-2 opacity-80" />
        <h2 className="text-2xl font-bold text-brand-textMain">Backend connection unavailable</h2>
        <p className="text-brand-textSecondary max-w-md">
          The FastAPI backend server is currently unreachable. Please ensure it is running to view the dashboard intelligence.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-textMain">System Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric Cards */}
        <div className="glass-card-elevated p-5 flex flex-col hover:border-brand-amberDark/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-brand-textMuted font-medium text-xs uppercase tracking-wider">Records</h3>
            <Database className="w-4 h-4 text-brand-amberDark" />
          </div>
          <p className="text-2xl font-bold text-brand-textMain">{eda?.num_rows || 303}</p>
        </div>

        <div className="glass-card-elevated p-5 flex flex-col hover:border-brand-amberDark/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-brand-textMuted font-medium text-xs uppercase tracking-wider">Features</h3>
            <Activity className="w-4 h-4 text-brand-amberDark" />
          </div>
          <p className="text-2xl font-bold text-brand-textMain">{eda?.num_cols || 13}</p>
        </div>

        <div className="glass-card-elevated p-5 flex flex-col hover:border-brand-amberDark/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-brand-textMuted font-medium text-xs uppercase tracking-wider">Disease Cases</h3>
            <Users className="w-4 h-4 text-brand-amberMain" />
          </div>
          <p className="text-2xl font-bold text-brand-textMain">{eda?.target_distribution?.['1'] || 139}</p>
        </div>

        <div className="glass-card-elevated p-5 flex flex-col hover:border-brand-amberDark/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-brand-textMuted font-medium text-xs uppercase tracking-wider">Accuracy</h3>
            <CheckCircle className="w-4 h-4 text-[#F2C982]" />
          </div>
          <p className="text-2xl font-bold text-brand-textMain">
            {metrics ? (metrics.accuracy * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="glass-card-elevated p-5 flex flex-col hover:border-brand-amberDark/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-brand-textMuted font-medium text-xs uppercase tracking-wider">Precision</h3>
            <CheckCircle className="w-4 h-4 text-[#F2C982]" />
          </div>
          <p className="text-2xl font-bold text-brand-textMain">
            {metrics ? (metrics.precision * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="glass-card-elevated p-5 flex flex-col hover:border-brand-amberDark/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-brand-textMuted font-medium text-xs uppercase tracking-wider">Recall</h3>
            <CheckCircle className="w-4 h-4 text-[#F2C982]" />
          </div>
          <p className="text-2xl font-bold text-brand-textMain">
            {metrics ? (metrics.recall * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="glass-card-elevated p-5 flex flex-col hover:border-brand-amberDark/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-brand-textMuted font-medium text-xs uppercase tracking-wider">F1 Score</h3>
            <Percent className="w-4 h-4 text-[#F2C982]" />
          </div>
          <p className="text-2xl font-bold text-brand-textMain">
            {metrics ? (metrics.f1_score * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="glass-card-elevated p-5 flex flex-col border border-brand-amberMain/30 hover:border-brand-amberMain transition-all duration-300 bg-brand-amberDark/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-brand-amberMain font-bold text-xs uppercase tracking-wider">ROC-AUC</h3>
            <Activity className="w-4 h-4 text-brand-amberMain" />
          </div>
          <p className="text-2xl font-bold text-brand-textMain">
            {metrics ? (metrics.roc_auc * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-brand-textMain mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-brand-amberMain" /> Model Architecture
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between border-b border-brand-border pb-3">
              <span className="text-brand-textSecondary text-sm">Algorithm</span>
              <span className="text-brand-textMain font-medium">{modelInfo?.architecture || 'SVM (SVC)'}</span>
            </li>
            <li className="flex justify-between border-b border-brand-border pb-3">
              <span className="text-brand-textSecondary text-sm">Kernel</span>
              <span className="text-brand-textMain font-medium">{modelInfo?.kernel || 'RBF'}</span>
            </li>
            <li className="flex justify-between border-b border-brand-border pb-3">
              <span className="text-brand-textSecondary text-sm">Features</span>
              <span className="text-brand-textMain font-medium">{modelInfo?.features || 13}</span>
            </li>
            <li className="flex justify-between border-b border-brand-border pb-3">
              <span className="text-brand-textSecondary text-sm">Split Ratio</span>
              <span className="text-brand-textMain font-medium">{modelInfo?.training_split || '80/20'}</span>
            </li>
          </ul>
        </div>
        <div className="glass-card p-8 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden group border border-[#D99A4A]/20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8B56A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="z-10 flex-1 pr-4 mb-6 sm:mb-0 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-brand-textMain mb-3 tracking-wide">Ready for Inference</h2>
              <p className="text-brand-textSecondary text-sm leading-relaxed mb-6">
                  System ready for clinical risk prediction. Run a prediction using patient parameters.
              </p>
              <button 
                className="bg-brand-amberMain hover:bg-brand-amberLight text-brand-mainBg font-bold py-2 px-6 rounded-lg transition-colors shadow-[0_0_15px_rgba(232,181,106,0.3)]"
                onClick={() => window.location.href = '/prediction'}
              >
                Start Risk Prediction
              </button>
            </div>

            <div className="z-10 w-full sm:w-1/2 h-[300px]">
              <HeartModelVisualization scale={1.2} />
            </div>
        </div>
      </div>
    </div>
  );
}

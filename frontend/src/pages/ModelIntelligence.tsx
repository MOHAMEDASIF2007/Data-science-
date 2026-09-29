import { useEffect, useState } from 'react';
import { getMetrics, getFeatureImportance, getModelInfo } from '../services/api';
import { BrainCircuit, Activity, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ModelIntelligence() {
  const [metrics, setMetrics] = useState<any>(null);
  const [importance, setImportance] = useState<any>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMetrics().catch(() => ({ data: null })),
      getFeatureImportance().catch(() => ({ data: null })),
      getModelInfo().catch(() => ({ data: null }))
    ]).then(([metricsRes, impRes, infoRes]) => {
      if (metricsRes.data) setMetrics(metricsRes.data);
      if (impRes.data) setImportance(impRes.data);
      if (infoRes.data) setModelInfo(infoRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-brand-purpleMain text-center py-20 flex justify-center items-center"><Activity className="animate-spin w-8 h-8 mr-3"/> Loading model data...</div>;

  if (!metrics || !importance || !modelInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-[#A78BFA] mb-2 opacity-80" />
        <h2 className="text-2xl font-bold text-brand-textMain">Backend connection unavailable</h2>
        <p className="text-brand-textSecondary max-w-md">
          The FastAPI backend server is currently unreachable. Please ensure it is running to view model intelligence.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-textMain mb-6 flex items-center">
        <BrainCircuit className="mr-3 w-8 h-8 text-brand-purpleMain" /> 
        Model <span className="text-brand-purpleMain ml-2 border-b-2 border-brand-purpleMain">Intelligence</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-t-2 border-t-brand-purpleMain">
          <h2 className="text-xl font-bold text-brand-textMain mb-6 flex items-center">Architecture & Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
              <p className="text-brand-textMuted text-xs uppercase tracking-wider mb-2">Algorithm</p>
              <p className="text-brand-purpleMain font-bold text-lg">{modelInfo?.architecture || 'SVM (SVC)'}</p>
            </div>
            <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
              <p className="text-brand-textMuted text-xs uppercase tracking-wider mb-2">Kernel</p>
              <p className="text-brand-purpleMain font-bold text-lg">{modelInfo?.kernel || 'RBF'}</p>
            </div>
            <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
              <p className="text-brand-textMuted text-xs uppercase tracking-wider mb-2">Training Split</p>
              <p className="text-brand-textMain font-medium">{modelInfo?.training_split || '80/20'}</p>
            </div>
            <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
              <p className="text-brand-textMuted text-xs uppercase tracking-wider mb-2">Preprocessing</p>
              <p className="text-brand-textSecondary font-medium text-xs break-words">{modelInfo?.preprocessing}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-t-2 border-t-brand-border">
          <h2 className="text-xl font-bold text-brand-textMain mb-6 flex items-center">Performance Metrics</h2>
          {metrics && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-brand-textSecondary font-medium">Accuracy</span>
                  <span className="text-brand-textMain font-bold">{(metrics.accuracy * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-brand-elevated border border-brand-border rounded-full h-2 overflow-hidden">
                  <div className="bg-brand-purpleMain h-full rounded-full" style={{ width: `${metrics.accuracy * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-brand-textSecondary font-medium">Precision</span>
                  <span className="text-brand-textMain font-bold">{(metrics.precision * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-brand-elevated border border-brand-border rounded-full h-2 overflow-hidden">
                  <div className="bg-brand-purpleLight h-full rounded-full" style={{ width: `${metrics.precision * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-brand-textSecondary font-medium">Recall</span>
                  <span className="text-brand-textMain font-bold">{(metrics.recall * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-brand-elevated border border-brand-border rounded-full h-2 overflow-hidden">
                  <div className="bg-[#8B5CF6] h-full rounded-full" style={{ width: `${metrics.recall * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-brand-textSecondary font-medium">F1 Score</span>
                  <span className="text-brand-textMain font-bold">{(metrics.f1_score * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-brand-elevated border border-brand-border rounded-full h-2 overflow-hidden">
                  <div className="bg-[#7C3AED] h-full rounded-full" style={{ width: `${metrics.f1_score * 100}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-brand-textMain mb-6">Confusion Matrix</h2>
          {metrics && metrics.confusion_matrix && (
            <div className="flex justify-center items-center py-6">
              <div className="grid grid-cols-2 gap-3 text-center w-72">
                <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
                  <p className="text-xs text-brand-textMuted uppercase tracking-widest mb-1.5">True Negative</p>
                  <p className="text-2xl text-brand-textMain font-bold">{metrics.confusion_matrix.tn}</p>
                </div>
                <div className="bg-brand-purpleMain/10 p-5 rounded-xl border border-brand-purpleMain/30">
                  <p className="text-xs text-brand-purpleMain uppercase tracking-widest mb-1.5">False Positive</p>
                  <p className="text-2xl text-brand-purpleLight font-bold">{metrics.confusion_matrix.fp}</p>
                </div>
                <div className="bg-brand-purpleMain/10 p-5 rounded-xl border border-brand-purpleMain/30">
                  <p className="text-xs text-brand-purpleMain uppercase tracking-widest mb-1.5">False Negative</p>
                  <p className="text-2xl text-brand-purpleLight font-bold">{metrics.confusion_matrix.fn}</p>
                </div>
                <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
                  <p className="text-xs text-brand-textMuted uppercase tracking-widest mb-1.5">True Positive</p>
                  <p className="text-2xl text-brand-textMain font-bold">{metrics.confusion_matrix.tp}</p>
                </div>
              </div>
            </div>
          )}
          <p className="text-xs text-brand-textMuted text-center mt-2 italic">
            * False negatives represent cases where disease was present but not detected. In medical screening, minimizing this is a priority.
          </p>
        </div>

        {/* ROC Curve */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-brand-textMain mb-6 flex items-center justify-between">
            ROC Curve
            {metrics?.roc_auc && (
              <span className="text-sm font-semibold text-brand-purpleMain bg-brand-purpleMain/10 px-3 py-1 rounded-full border border-brand-purpleMain/20">
                AUC: {(metrics.roc_auc * 100).toFixed(1)}%
              </span>
            )}
          </h2>
          {metrics?.roc_curve && (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  data={metrics.roc_curve.fpr.map((fpr: number, idx: number) => ({
                    fpr: Number(fpr.toFixed(3)),
                    tpr: Number(metrics.roc_curve.tpr[idx].toFixed(3))
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#24344A" />
                  <XAxis 
                    dataKey="fpr" 
                    type="number" 
                    domain={[0, 1]} 
                    tickCount={6} 
                    stroke="#9AA9BA" 
                    fontSize={12}
                    tickFormatter={(val) => val.toFixed(1)}
                  />
                  <YAxis 
                    domain={[0, 1]} 
                    tickCount={6} 
                    stroke="#9AA9BA" 
                    fontSize={12}
                    tickFormatter={(val) => val.toFixed(1)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#101D2D', borderColor: '#24344A', borderRadius: '8px' }}
                    itemStyle={{ color: '#A78BFA' }}
                    labelStyle={{ color: '#9AA9BA' }}
                    formatter={(value: any, name: any) => [value, name === 'tpr' ? 'True Positive Rate' : name]}
                    labelFormatter={(label: any) => `False Positive Rate: ${label}`}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="tpr" 
                    stroke="#A78BFA" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#101D2D' }}
                  />
                  <Line 
                    type="linear" 
                    data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} 
                    dataKey="tpr" 
                    stroke="#4B5E76" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-xs text-brand-textMuted text-center mt-4 italic">
            The Receiver Operating Characteristic (ROC) curve evaluates the trade-off between True Positive Rate and False Positive Rate across all classification thresholds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-brand-textMain mb-6">Global Feature Importance (Permutation)</h2>
          {importance && (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {importance.slice(0, 8).map((imp: any, i: number) => {
                // Normalize for display purposes
                const max = importance[0].importance_mean;
                const width = max > 0 ? (imp.importance_mean / max) * 100 : 0;
                
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-brand-textSecondary font-mono">{imp.feature.replace('num__', '').replace('cat__', '')}</span>
                      <span className="text-brand-textMuted">Score: {imp.importance_mean.toFixed(3)}</span>
                    </div>
                    <div className="w-full bg-brand-elevated border border-brand-border rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-brand-purpleMain to-brand-purpleLight h-full rounded-full" style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <p className="text-[10px] text-brand-textMuted mt-6 border-t border-brand-border pt-4">
            These features had the strongest influence on the trained model across the evaluation dataset.
          </p>
        </div>
      </div>
    </div>
  );
}

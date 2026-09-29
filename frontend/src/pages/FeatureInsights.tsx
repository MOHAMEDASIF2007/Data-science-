import { useEffect, useState } from 'react';
import { getFeatureImportance } from '../services/api';
import { Activity, Zap, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export default function FeatureInsights() {
  const [importance, setImportance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeatureImportance()
      .then(res => {
        if (res.data) setImportance(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-brand-explainAmberMain text-center py-20 flex justify-center items-center"><Activity className="animate-spin w-8 h-8 mr-3"/> Loading feature insights...</div>;

  if (!importance) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-[#F59E0B] mb-2 opacity-80" />
        <h2 className="text-2xl font-bold text-brand-textMain">Backend connection unavailable</h2>
        <p className="text-brand-textSecondary max-w-md">
          The FastAPI backend server is currently unreachable. Please ensure it is running to view feature insights.
        </p>
      </div>
    );
  }

  const featureLabels: Record<string, string> = {
    thalach: "Maximum Heart Rate",
    oldpeak: "ST Depression",
    ca: "Major Vessels",
    thal: "Thalassemia",
    cp: "Chest Pain Type",
    age: "Age",
    chol: "Cholesterol",
    slope: "Exercise ST Slope",
    exang: "Exercise-Induced Angina",
    trestbps: "Resting Blood Pressure",
    fbs: "Fasting Blood Sugar",
    sex: "Sex",
    restecg: "Resting ECG"
  };

  const chartData = importance ? importance.map((imp: any) => {
    const rawName = imp.feature.replace('num__', '').replace('cat__', '');
    return {
      rawName: rawName,
      name: featureLabels[rawName] || rawName,
      value: imp.importance_mean
    };
  }) : [];

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const dataItem = chartData.find((d: any) => d.name === payload.value);
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={-4} dy={0} textAnchor="end" fill="#F4F7FA" fontSize={11} fontWeight="600">{payload.value}</text>
        {dataItem && (
          <text x={0} y={10} dy={0} textAnchor="end" fill="#9AA9BA" fontSize={9}>{dataItem.rawName}</text>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-textMain mb-6 flex items-center">
        <Zap className="mr-3 w-8 h-8 text-brand-explainAmberMain" /> 
        Model <span className="text-brand-explainAmberMain ml-2 border-b-2 border-brand-explainAmberMain">Explainability</span>
      </h1>

      <div className="glass-card p-8 border-t-2 border-t-brand-explainAmberMain">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-bold text-brand-textMain">Global Feature Importance Ranking</h2>
          
          {/* Requested Legend/Badge */}
          <div className="mt-4 md:mt-0 text-right">
            <div className="inline-flex items-center space-x-2 bg-brand-explainAmberMain/10 border border-brand-explainAmberMain/30 px-3 py-1 rounded-full text-brand-explainAmberMain mb-1">
              <span className="text-[10px] font-bold tracking-widest uppercase">Model Explainability</span>
            </div>
            <p className="text-xs text-brand-textSecondary font-medium">Model-level feature influence</p>
          </div>
        </div>
        
        <div className="h-96 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#24344A" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#9AA9BA" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={<CustomYAxisTick />} width={160} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#101D2D', borderColor: '#24344A', borderRadius: '12px', color: '#F4F7FA' }}
                itemStyle={{ color: '#F59E0B' }}
                cursor={{ fill: 'rgba(245, 158, 11, 0.05)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? '#F59E0B' : index < 6 ? '#FDBA74' : '#EA9A2B'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[10px] text-brand-textMuted text-center mb-8 pb-4 border-b border-brand-border">
          Higher magnitude indicates greater influence on model behavior. This does not represent medical causation.
        </div>

        <div className="bg-brand-secondaryBg p-6 rounded-xl border border-brand-border">
          <h3 className="text-lg font-semibold text-brand-explainAmberMain mb-2">How to Interpret These Results</h3>
          <p className="text-brand-textSecondary text-sm leading-relaxed mb-4">
            These features had the strongest influence on the trained model across the evaluation dataset. 
            The importance score (permutation importance) measures how much the model's accuracy decreases 
            when a feature's values are randomly shuffled. A higher score means the model relies on that feature more heavily.
          </p>
          <div className="flex items-start text-sm text-brand-textMuted bg-brand-elevated border border-brand-border p-4 rounded-lg">
            <Activity className="w-5 h-5 mr-3 text-brand-explainAmberDark shrink-0" />
            <p>
              <strong className="text-brand-textMain font-medium">Important Note:</strong> This ranking represents model-influencing factors and statistical associations learned during training. It does not necessarily indicate direct medical causation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getEdaSummary } from '../services/api';
import { BarChart3, Activity, ListChecks, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function EDA() {
  const [eda, setEda] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEdaSummary()
      .then(res => {
        if (res.data) setEda(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-brand-cyanMain text-center py-20 flex justify-center items-center"><Activity className="animate-spin w-8 h-8 mr-3"/> Loading EDA...</div>;

  if (!eda) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-[#D99A4A] mb-2 opacity-80" />
        <h2 className="text-2xl font-bold text-brand-textMain">Backend connection unavailable</h2>
        <p className="text-brand-textSecondary max-w-md">
          The FastAPI backend server is currently unreachable. Please ensure it is running to view EDA insights.
        </p>
      </div>
    );
  }

  const COLORS = ['#38BDF8', '#0284C7', '#0369A1', '#67E8F9', '#BAE6FD'];

  // Data parsers
  const parseHist = (dist: any) => dist ? Object.keys(dist).map(k => ({ name: k, count: dist[k] })) : [];
  const parsePie = (dist: any) => dist ? Object.keys(dist).map(k => ({ name: k, value: dist[k] })) : [];
  const parseVsTarget = (arr: any[]) => arr || [];

  const ageData = parseHist(eda.age_distribution);
  const cholData = parseHist(eda.chol_distribution);
  const trestbpsData = parseHist(eda.trestbps_distribution);
  const thalachData = parseHist(eda.thalach_distribution);
  const oldpeakData = parseHist(eda.oldpeak_distribution);

  const sexData = parsePie(eda.sex_distribution).map(d => ({ ...d, name: d.name === '1.0' ? 'Male' : 'Female' }));
  const cpData = parsePie(eda.cp_distribution).map(d => ({ ...d, name: `Type ${d.name}` }));
  const exangData = parsePie(eda.exang_distribution).map(d => ({ ...d, name: d.name === '1.0' ? 'Yes' : 'No' }));
  const restecgData = parsePie(eda.restecg_distribution).map(d => ({ ...d, name: `Value ${d.name}` }));
  
  const targetData = [
    { name: 'No Disease (0)', value: eda?.target_distribution?.['0'] || 0 },
    { name: 'Disease (1)', value: eda?.target_distribution?.['1'] || 0 },
  ];

  const renderBarChart = (data: any[], xKey: string, yKey: string, title: string) => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-brand-textMain mb-6">{title}</h2>
      <div className="h-64">
        {data.length === 0 ? <div className="text-brand-textMuted flex items-center justify-center h-full">No data available.</div> : 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#24344A" vertical={false} />
            <XAxis dataKey={xKey} stroke="#9AA9BA" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#9AA9BA" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#101D2D', borderColor: '#24344A', borderRadius: '12px', color: '#F4F7FA' }} itemStyle={{ color: '#38BDF8' }} cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }} />
            <Bar dataKey={yKey} fill="#38BDF8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>}
      </div>
    </div>
  );

  const renderPieChart = (data: any[], title: string) => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-brand-textMain mb-6">{title}</h2>
      <div className="h-64 relative">
        {data.length === 0 ? <div className="text-brand-textMuted flex items-center justify-center h-full">No data available.</div> : 
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
              {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#101D2D', borderColor: '#24344A', borderRadius: '12px', color: '#F4F7FA' }} itemStyle={{ color: '#F4F7FA' }} />
          </PieChart>
        </ResponsiveContainer>}
      </div>
    </div>
  );

  const renderStackedBar = (data: any[], title: string, xKey: string = 'range') => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-brand-textMain mb-6">{title}</h2>
      <div className="h-64">
        {data.length === 0 ? <div className="text-brand-textMuted flex items-center justify-center h-full">No data available.</div> : 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#24344A" vertical={false} />
            <XAxis dataKey={xKey} stroke="#9AA9BA" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#9AA9BA" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#101D2D', borderColor: '#24344A', borderRadius: '12px', color: '#F4F7FA' }} itemStyle={{ color: '#38BDF8' }} cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }} />
            <Bar dataKey="0" stackId="a" fill="#0284C7" name="No Disease" />
            <Bar dataKey="1" stackId="a" fill="#38BDF8" name="Disease" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-textMain mb-6 flex items-center">
        <BarChart3 className="mr-3 w-8 h-8 text-brand-cyanMain" /> 
        Dataset <span className="text-brand-cyanMain ml-2 border-b-2 border-brand-cyanMain">Analysis</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderBarChart(ageData, 'name', 'count', '1. Age Distribution')}
        {renderPieChart(targetData, '2. Target Distribution')}
        {renderPieChart(sexData, '3. Sex Distribution')}
        
        {renderPieChart(cpData, '4. Chest Pain Distribution')}
        {renderBarChart(cholData, 'name', 'count', '5. Cholesterol Distribution')}
        {renderBarChart(trestbpsData, 'name', 'count', '6. Resting Blood Pressure')}
        
        {renderBarChart(thalachData, 'name', 'count', '7. Maximum Heart Rate')}
        {renderPieChart(exangData, '8. Exercise-Induced Angina')}
        {renderBarChart(oldpeakData, 'name', 'count', '9. ST Depression')}
        
        {renderPieChart(restecgData, '10. Resting ECG')}
        {renderStackedBar(parseVsTarget(eda.age_vs_target), '11. Age vs Heart Disease')}
        {renderStackedBar(parseVsTarget(eda.cp_vs_target), '12. Chest Pain vs Heart Disease', 'value')}
        
        {renderStackedBar(parseVsTarget(eda.chol_vs_target), '13. Cholesterol vs Heart Disease')}
        {renderStackedBar(parseVsTarget(eda.trestbps_vs_target), '14. Blood Pressure vs Heart Disease')}
        {renderStackedBar(parseVsTarget(eda.thalach_vs_target), '15. Maximum Heart Rate vs Heart Disease')}
        
        {renderStackedBar(parseVsTarget(eda.oldpeak_vs_target), '16. ST Depression vs Heart Disease')}
        {renderStackedBar(parseVsTarget(eda.exang_vs_target), '17. Exercise Angina vs Heart Disease', 'value')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Values (19) */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-brand-textMain mb-6 flex items-center">
            <ListChecks className="mr-3 w-5 h-5 text-brand-cyanMain" /> 19. Data Quality Assessment (Missing Values)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
              <p className="text-brand-textMuted text-xs uppercase tracking-wider mb-2">Total Rows</p>
              <p className="text-2xl text-brand-textMain font-bold">{eda?.num_rows || 0}</p>
            </div>
            <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
              <p className="text-brand-textMuted text-xs uppercase tracking-wider mb-2">Total Columns</p>
              <p className="text-2xl text-brand-textMain font-bold">{eda?.num_cols || 0}</p>
            </div>
            <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border col-span-2">
              <p className="text-brand-textMuted text-xs uppercase tracking-wider mb-3">Missing Values Summary</p>
              <ul className="text-sm space-y-2 max-h-40 overflow-y-auto">
                {eda?.missing_values && Object.entries(eda.missing_values).map(([col, count]: [string, any]) => (
                  count > 0 && (
                    <li key={col} className="flex justify-between items-center border-b border-brand-border/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-brand-textSecondary font-mono text-xs">{col}</span>
                      <span className="text-brand-amberDark font-bold bg-[#D99A4A]/10 px-2 py-0.5 rounded">{count}</span>
                    </li>
                  )
                ))}
                {Object.values(eda?.missing_values || {}).every((v: any) => v === 0) && (
                  <li className="text-brand-cyanMain font-medium flex items-center">
                    <Activity className="w-4 h-4 mr-2" /> No missing values detected.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Outlier Analysis (20) */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-brand-textMain mb-6 flex items-center">
            <AlertCircle className="mr-3 w-5 h-5 text-brand-cyanMain" /> 20. Outlier Analysis (IQR Method)
          </h2>
          <div className="bg-brand-secondaryBg p-5 rounded-xl border border-brand-border">
            <p className="text-sm text-brand-textSecondary mb-4">Outliers detected using the Interquartile Range (1.5 * IQR) method for continuous variables.</p>
            <ul className="text-sm space-y-3">
              {eda?.outliers ? Object.entries(eda.outliers).map(([col, details]: [string, any]) => (
                <li key={col} className="flex flex-col border-b border-brand-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-brand-textMain font-mono text-xs uppercase">{col}</span>
                    <span className="text-[#0284C7] font-bold bg-[#0284C7]/10 px-2 py-0.5 rounded">{details.count} outliers</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-brand-textMuted">
                    <span>Lower bound: {details.lower_bound.toFixed(2)}</span>
                    <span>Upper bound: {details.upper_bound.toFixed(2)}</span>
                  </div>
                </li>
              )) : <li className="text-brand-textMuted">No outlier data available.</li>}
            </ul>
          </div>
        </div>

        {/* Correlation Heatmap (18) */}
        <div className="glass-card p-8 md:col-span-2">
          <h2 className="text-xl font-bold text-brand-textMain mb-6 flex items-center">
            <Activity className="mr-3 w-5 h-5 text-brand-cyanMain" /> 18. Target Correlation Heatmap
          </h2>
          {eda?.correlation?.heart_disease ? (
            <div className="space-y-4">
              <p className="text-sm text-brand-textSecondary mb-4">
                Pearson correlation coefficients between clinical features and the presence of heart disease. Positive values indicate a direct relationship, negative values indicate an inverse relationship.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(eda.correlation.heart_disease)
                  .filter(([key]) => key !== 'heart_disease')
                  .sort(([, a], [, b]) => Math.abs(b as number) - Math.abs(a as number))
                  .map(([key, value]) => {
                    const val = value as number;
                    const isPositive = val > 0;
                    const width = Math.abs(val) * 100;
                    return (
                      <div key={key} className="flex items-center text-sm">
                        <span className="w-24 truncate text-brand-textSecondary font-medium">{key}</span>
                        <span className="w-12 text-right text-brand-textMuted text-xs mr-3 font-mono">{val.toFixed(2)}</span>
                        <div className="flex-1 h-2 bg-brand-elevated border border-brand-border rounded-full overflow-hidden flex">
                          <div className="w-1/2 flex justify-end">
                            {!isPositive && (
                              <div className="h-full bg-[#4B5E76] rounded-l-full" style={{ width: `${width}%` }}></div>
                            )}
                          </div>
                          <div className="w-1/2 flex justify-start">
                            {isPositive && (
                              <div className="h-full bg-brand-cyanMain rounded-r-full" style={{ width: `${width}%` }}></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
                <h3 className="text-xl font-bold text-brand-textMain mb-3">Correlation Data Unavailable</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

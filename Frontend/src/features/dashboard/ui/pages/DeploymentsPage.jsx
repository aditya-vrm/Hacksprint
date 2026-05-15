import { Activity, Database, CheckCircle2, XCircle, ArrowUpRight, Box } from 'lucide-react';
import { DEPLOYMENTS } from '../../api/DeploymentsApi';

const DeploymentsPage = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col pb-12 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Deployments</h1>
          <p className="text-text-muted text-sm mt-1">Manage and monitor your infrastructure</p>
        </div>
        <button className="mt-4 md:mt-0 flex items-center bg-primary text-[#0B1120] font-bold px-4 py-2 rounded-lg hover:bg-primary-hover transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <Activity className="w-4 h-4 mr-2" />
          New Deployment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-text-muted" />
                Recent Deployments
              </h2>
              <div className="flex items-center space-x-2 text-xs text-text-muted font-mono bg-background border border-border px-3 py-1.5 rounded-md">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AUTO-REFRESH: ON
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-muted">
                <thead className="bg-surface-hover/30 text-xs uppercase font-mono border-b border-border">
                  <tr>
                    <th className="px-5 py-3 font-medium">Project / Commit</th>
                    <th className="px-5 py-3 font-medium">Environment</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DEPLOYMENTS.map((dep) => (
                    <tr key={dep.id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{dep.project}</div>
                        <div className="font-mono text-xs text-text-muted flex items-center mt-1">
                          <span className="text-primary mr-1">⎇</span> {dep.commit}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                          dep.env === 'PRODUCTION' ? "bg-accent/10 text-accent border border-accent/20" : "bg-text-muted/10 text-text-muted border border-text-muted/20"
                        }`}>
                          {dep.env}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          {dep.status === 'Success' && <CheckCircle2 className="w-4 h-4 text-primary mr-2" />}
                          {dep.status === 'Failed' && <XCircle className="w-4 h-4 text-red-400 mr-2" />}
                          {dep.status === 'In Progress' && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          <span className={`font-medium ${
                            dep.status === 'Success' ? "text-white" :
                            dep.status === 'Failed' ? "text-red-400" :
                            dep.status === 'In Progress' ? "text-text-muted" : ""
                          }`}>
                            {dep.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-text-muted">{dep.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border flex justify-center">
              <button className="text-sm font-medium text-text-muted hover:text-white transition-colors flex items-center">
                View All Deployment Logs
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
      
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="text-md font-bold text-white flex items-center border-b border-border/50 pb-4 mb-4">
              <Database className="w-4 h-4 mr-2 text-text-muted" />
              Build Artifacts Storage
            </h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-3xl font-bold text-white">64.8 GB</div>
                  <div className="text-xs text-text-muted">Used of 100 GB</div>
                </div>
                <div className="text-primary font-bold">64.8%</div>
              </div>
              
              <div className="flex items-end space-x-1 h-16 mt-4">
                {[4, 6, 3, 7, 9, 5, 8, 4, 3].map((val, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-colors" style={{ height: `${val * 10}%` }}></div>
                ))}
              </div>
              <div className="h-1 w-full bg-border mt-1 relative overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: '64.8%' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background border border-border p-3 rounded-lg">
                <div className="text-xs font-mono text-text-muted uppercase mb-1">Docker Images</div>
                <div className="text-lg font-bold text-white">42.1 GB</div>
              </div>
              <div className="bg-background border border-border p-3 rounded-lg">
                <div className="text-xs font-mono text-text-muted uppercase mb-1">CI Cache</div>
                <div className="text-lg font-bold text-white">22.7 GB</div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="text-md font-bold text-white flex items-center border-b border-border/50 pb-4 mb-4">
              <Box className="w-4 h-4 mr-2 text-text-muted" />
              Quick Docs: Pipeline
            </h2>

            <div className="space-y-5">
              {[
                { title: 'YAML Configuration', desc: 'Learn how to structure your devhub.yaml for multi-stage deployments.' },
                { title: 'Secrets Management', desc: 'Securely inject environment variables using our AES-256 encrypted vault system.' },
                { title: 'Custom Runners', desc: 'Connect your own high-performance bare metal servers to the DevHub orchestration layer.' }
              ].map((doc, i) => (
                <a key={i} href="#" className="block group">
                  <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors flex items-center justify-between">
                    {doc.title}
                    <ArrowUpRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {doc.desc}
                  </p>
                </a>
              ))}
            </div>

            <div className="mt-6 bg-background border border-border rounded-lg p-3">
              <div className="text-[10px] font-mono text-text-muted uppercase mb-2">CLI TRIGGER</div>
              <code className="text-xs text-primary font-mono">$ devhub deploy --env prod</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentsPage;

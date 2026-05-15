import { useState } from 'react';
import { Search, Book, Users, Activity, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: "How do I rotate my API keys?",
    answer: <>Navigate to your <code className="bg-surface-hover text-primary px-1.5 py-0.5 rounded text-xs">/settings/security</code> page. Under the "Authentication" section, you'll find the "Rotate Secret" button. Note that the old key will remain active for 24 hours to prevent production downtime.</>
  },
  {
    question: "What are the rate limits for the Free tier?",
    answer: "Free tier includes 10,000 API requests per month, 100 concurrent connections, and 2GB of edge cache storage. You can view your current usage in the Analytics dashboard."
  },
  {
    question: "Can I use DevHub in a self-hosted environment?",
    answer: "Yes, DevHub offers an Enterprise plan that includes self-hosted docker images, Kubernetes helm charts, and dedicated premium support for on-premise deployments."
  },
  {
    question: "How do I integrate Custom Webhooks?",
    answer: "Go to your Project Settings > Webhooks. Click 'Add Webhook', enter your endpoint URL, and select the events you want to listen to. We use HMAC SHA-256 for payload verification."
  }
];

const SupportHub = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="max-w-6xl mx-auto flex flex-col pb-12 animate-in fade-in duration-500">
      
      <div className="text-center mb-12 mt-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">Support Hub</h1>
        <p className="text-text-muted max-w-2xl mx-auto text-sm md:text-base">
          Find technical guides, community solutions, or open a high-priority ticket with our engineering team.
        </p>
        
        <div className="mt-8 relative max-w-3xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-muted" />
          </div>
          <input 
            type="text" 
            placeholder="How can we help?"
            className="block w-full pl-11 pr-16 py-4 bg-surface border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="flex space-x-1">
              <kbd className="bg-surface-hover border border-border px-2 py-1 text-xs text-text-muted rounded">⌘</kbd>
              <kbd className="bg-surface-hover border border-border px-2 py-1 text-xs text-text-muted rounded">K</kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group cursor-pointer">
          <Book className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-white mb-2">Core Docs</h3>
          <p className="text-sm text-text-muted leading-relaxed">Detailed technical specifications, architecture diagrams, and deployment guides.</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group cursor-pointer">
          <Users className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
          <p className="text-sm text-text-muted leading-relaxed">Connect with other DevHub engineers. Share solutions and browse community plugins.</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group cursor-pointer">
          <Activity className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-white mb-2">API Status</h3>
          <p className="text-sm text-text-muted leading-relaxed">Real-time monitoring for all endpoints, edge nodes, and database clusters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="bg-surface border border-border rounded-xl overflow-hidden hover:border-border/80 transition-colors">
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isOpen ? 'bg-surface-hover/50' : ''}`}
                  >
                    <span className={`transition-colors ${isOpen ? 'text-white font-semibold' : 'text-white font-medium'}`}>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-5 border-t border-border bg-surface text-sm text-text-muted leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
            <h3 className="text-xl font-bold text-white mb-6">Support Ticket</h3>
            
            <form className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Priority Level: Standard</label>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Issue Category</label>
                <div className="relative">
                  <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-primary transition-colors">
                    <option>Technical Integration</option>
                    <option>Billing</option>
                    <option>Bug Report</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Subject</label>
                <input 
                  type="text" 
                  placeholder="Briefly describe the issue"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  rows="4"
                  placeholder="Steps to reproduce, environment details..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-text-muted/50 focus:outline-none focus:border-primary transition-colors resize-none"
                ></textarea>
              </div>

              <button type="button" className="w-full bg-primary hover:bg-primary-hover text-[#0B1120] font-bold py-3 rounded-lg text-sm tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] mt-4">
                SUBMIT REQUEST
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-surface border border-border rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <h3 className="text-xl font-bold text-white">Systems Operational</h3>
          </div>
          <div className="bg-background border border-border px-4 py-1.5 rounded-full text-xs font-mono text-text-muted">
            99.98% Uptime Last 90 Days
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { region: 'US-EAST-1' },
            { region: 'EU-WEST-2' },
            { region: 'AP-SOUTH-1' },
            { region: 'EDGE-NET' }
          ].map((sys) => (
            <div key={sys.region} className="bg-background border border-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-text-muted">{sys.region}</span>
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Operational</span>
              </div>
              <div className="flex space-x-1 h-8">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm ${i > 11 ? "bg-primary/20" : "bg-primary"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted pb-8">
        <div className="mb-4 md:mb-0">
          <p className="font-semibold text-white mb-1">DevHub Engine</p>
          <p>© 2024 DevHub Engine. Built for developers by developers.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white underline decoration-border underline-offset-4">Terms of Service</a>
          <a href="#" className="hover:text-white underline decoration-border underline-offset-4">Privacy Policy</a>
          <a href="#" className="hover:text-white underline decoration-border underline-offset-4">API Docs</a>
          <a href="#" className="hover:text-white underline decoration-border underline-offset-4">GitHub Status</a>
        </div>
      </footer>
    </div>
  );
};

export default SupportHub;

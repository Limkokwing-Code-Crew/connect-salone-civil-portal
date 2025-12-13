import { Mail, Send, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-gray-900 border-t border-slate-700/50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gold-400 to-amber-400 bg-clip-text text-transparent mb-4">
              SaloneHub
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Fast, transparent access to Sierra Leone's verified government services.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/services" className="hover:text-gold-400 transition">Services</a></li>
              <li><a href="/representatives" className="hover:text-gold-400 transition">Representatives</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe for live updates on service requirements and timelines.
            </p>
            <div className="flex bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <input 
                type="email" 
                placeholder="Notify me" 
                className="bg-transparent border-none outline-none flex-1 text-slate-200 placeholder-slate-500 text-sm"
              />
              <button className="ml-2 p-2 hover:bg-gold-500/20 rounded-lg transition">
                <Send size={18} className="text-gold-400" />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+232 76 XXX XXX</span>
              </div>
              <div>info@salonehub.sl</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-xs text-slate-500">
          <p>Built for citizens & teams. Hackathon-ready MVP.</p>
          <p className="mt-2 opacity-75">Offline-ready · Secure · Transparent</p>
        </div>
      </div>
    </footer>
  );
}

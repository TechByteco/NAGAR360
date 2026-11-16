import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, AlertTriangle, Droplets, Lightbulb, Trees } from 'lucide-react';

export default function DepartmentsPage() {
  const departments = [
    {
      name: 'Road & Infrastructure Department',
      desc: 'Handles asphalt tarring, pothole repairs, paver blocks, and footpaths across Chennai zones.',
      helpline: '1913 (GCC Toll-Free)',
      icon: AlertTriangle,
      color: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'Sanitation & Solid Waste Management',
      desc: 'Manages municipal compactor trucks, door-to-door bin clearance, Urbaser Sumeet conservancy teams.',
      helpline: '044-2538 4520',
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      name: 'Electrical & Street Lighting Department',
      desc: 'Maintains sodium luminaire poles, LED streetlights, junction boxes, and nocturnal safety corridors.',
      helpline: '044-2538 4530',
      icon: Lightbulb,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Metrowater & Drainage Board (CMWSSB)',
      desc: 'Manages drinking water pipeline bursts, stormwater drain silt removal, and sewer suction jetting.',
      helpline: '044-4567 4567',
      icon: Droplets,
      color: 'bg-cyan-100 text-cyan-800',
    },
    {
      name: 'Parks & Horticulture Department',
      desc: 'Manages storm fallen tree removal, sapling plantations, and public garden maintenance.',
      helpline: '044-2538 4540',
      icon: Trees,
      color: 'bg-green-100 text-green-800',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#1261A0] uppercase tracking-widest block">Municipal Services</span>
        <h1 className="text-3xl font-black text-gray-900">Greater Chennai Corporation Departments</h1>
        <p className="text-xs text-gray-500 max-w-xl">
          Nagar360 automatically routes your verified AI complaint to the relevant municipal department.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((d) => {
          const Icon = d.icon;
          return (
            <div key={d.name} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${d.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{d.name}</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{d.desc}</p>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#1261A0]" />
                  {d.helpline}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active Response Team
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

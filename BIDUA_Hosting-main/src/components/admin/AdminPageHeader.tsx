import { ReactNode } from 'react';

interface MetaItem {
  label: string;
  value: string;
  helper?: string;
}

interface AdminPageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
  meta?: MetaItem[];
}

export function AdminPageHeader({ title, description, actions, meta }: AdminPageHeaderProps) {
  return (
    <div className="bg-slate-950/70 backdrop-blur rounded-2xl border border-slate-800 px-6 py-6 shadow-[0_20px_55px_rgba(2,6,23,0.65)] flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-400 mb-2">Admin Console</p>
        <h1 className="text-3xl font-bold text-white drop-shadow-sm">{title}</h1>
        <p className="text-slate-300 mt-2 max-w-3xl leading-relaxed">{description}</p>

        {meta && meta.length > 0 && (
          <div className="flex flex-wrap gap-6 mt-6">
            {meta.map((item) => (
              <div
                key={item.label}
                className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 min-w-[150px]"
              >
                <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
                  {item.label}
                </p>
                <p className="text-xl font-semibold text-white mt-1">{item.value}</p>
                {item.helper && <p className="text-xs text-slate-400 mt-1">{item.helper}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
}

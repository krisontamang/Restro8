import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function WorkspaceHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="work-heading"><div><p className="work-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="work-description">{description}</p></div>{actions && <div className="work-actions">{actions}</div>}</header>;
}
export function ActionButton({ children, primary, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return <button type="button" className={['work-button', primary ? 'is-primary' : '', className].join(' ')} {...props}>{children}</button>;
}
export function FilterTabs<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: { value: T; label: string; count?: number }[] }) {
  return <div className="work-filters" role="group" aria-label={label}>{options.map(option => <button type="button" key={option.value} aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}{option.count !== undefined && <span>{option.count}</span>}</button>)}</div>;
}
export function MetricTile({ label, value, detail }: { label: string; value: ReactNode; detail: string }) {
  return <div className="work-metric"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}
export function EmptyPanel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <div className="work-empty"><span className="work-empty-mark" aria-hidden="true">—</span><h2>{title}</h2><p>{children}</p>{action}</div>;
}

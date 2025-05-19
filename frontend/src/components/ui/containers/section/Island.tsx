export function Island({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-base-200 p-6 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}

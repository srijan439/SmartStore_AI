const LoadingSkeleton = ({ className = "", rows = 1 }) => {
  if (rows > 1) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
};

export default LoadingSkeleton;

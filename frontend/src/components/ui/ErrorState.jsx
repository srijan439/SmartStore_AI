import { AlertTriangle, RefreshCw } from "lucide-react";

import AnimatedButton from "./AnimatedButton.jsx";

const ErrorState = ({ title = "Something went wrong", description, onRetry }) => {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-900 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-100">
      <div className="flex items-start gap-3">
        <AlertTriangle size={19} className="mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="mt-1 text-sm leading-6 opacity-85">{description}</p>}
          {onRetry && (
            <AnimatedButton variant="secondary" onClick={onRetry} className="mt-4">
              <RefreshCw size={16} />
              Retry
            </AnimatedButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;

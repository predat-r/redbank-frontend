export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div className={`animate-pulse bg-neutral-200 rounded-md ${className}`} {...props} />
  );
};

export const SkeletonCard = () => (
  <div className="p-6 bg-neutral-0 border border-neutral-200 rounded-xl space-y-4 shadow-sm animate-pulse">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-8 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

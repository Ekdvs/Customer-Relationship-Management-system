const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" }) => {
  if (size === "sm") {
    return (
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    );
  }
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
export default function StatGrid({ children }) {
  return (
     <div className="mx-auto max-w-xl grid grid-cols-2 gap-6">
      {children}
    </div>
  );
}

export default function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto max-w-[90rem] px-8 ${className}`}>
      {children}
    </div>
  );
}

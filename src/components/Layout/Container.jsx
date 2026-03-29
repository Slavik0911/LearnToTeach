// This component is used for wrapping the content of the pages, it provides a consistent layout and styling across the app
export default function Container({ children, className = "" }) {
    return (
        <div className={`mx-auto max-w-[90rem] px-8 ${className}`}>
            {children}
        </div>
    );
}

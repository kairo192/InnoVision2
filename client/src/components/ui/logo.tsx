interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * InnoVision School Logo Component
 * 
 * To replace the logo:
 * 1. Place your logo file in /client/public/ directory
 * 2. Update the src attribute below to point to your new logo file
 * 3. Adjust the styling (bg-white, object-cover) as needed for your logo
 */
export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 lg:w-12 lg:h-12", 
    lg: "w-16 h-16 lg:w-20 lg:h-20",
    xl: "w-20 h-20 lg:w-24 lg:h-24"
  };

  // Using the actual InnoVision School logo
  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden flex items-center justify-center bg-white shadow-lg`}>
      <img 
        src="/logo.jpg" 
        alt="InnoVision School Logo" 
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to text logo if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.className = parent.className.replace('bg-white', 'bg-accent');
            parent.innerHTML = `
              <div class="text-white font-bold text-center leading-tight ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-xl'}">
                <div>IV</div>
                <div class="text-xs opacity-80">SCHOOL</div>
              </div>
            `;
          }
        }}
      />
    </div>
  );
}
const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-12">
      <div className="max-w-md text-center">
        {/* Decorative illustration */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-primary/30 rounded-full animate-pulse delay-300"></div>
            <div className="absolute inset-8 bg-primary/40 rounded-full animate-pulse delay-700"></div>
            <div className="absolute inset-12 bg-primary/50 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4 text-primary">{title}</h2>
        <p className="text-base-content/70 mb-8 text-lg">{subtitle}</p>

        {/* Features list */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-base-content/80">Real-time messaging</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="text-sm text-base-content/80">Secure conversations</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm text-base-content/80">Modern interface</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-neutral rounded-full"></div>
            <span className="text-sm text-base-content/80">Cross-platform support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;

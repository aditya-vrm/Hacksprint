const WelcomeHeader = ({ userName, greetingMessage }) => {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-surface p-6 md:p-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="relative z-10">
        <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">
          Welcome Back
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
          {userName}
        </h1>
        <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
          {greetingMessage}
        </p>
      </div>
    </section>
  );
};

export default WelcomeHeader;

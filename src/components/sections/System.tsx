import { systemCopy } from "@/lib/copy";

export default function System() {
  return (
    <section id="system" className="relative px-6 py-32 bg-[#111111]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(245,158,11,0.02),transparent_50%)]"></div>
      
      <div className="relative mx-auto max-w-6xl">
        <div className="inline-block mb-4">
          <span className="text-sm font-medium text-amber-500 uppercase tracking-wider">System</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50 max-w-4xl">
          {systemCopy.title}
        </h2>

        <p className="mt-10 max-w-3xl text-lg md:text-xl leading-relaxed text-neutral-300 font-light">
          {systemCopy.intro.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {systemCopy.blocks.map((b, i) => (
            <div
              key={i}
              className="group relative rounded-xl border border-neutral-800 bg-[#1a1a1a] p-8 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <span className="text-amber-500 font-semibold text-lg">{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-50">{b.title}</h3>
              </div>
              
              <p className="text-neutral-300 leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-20 max-w-3xl text-lg md:text-xl leading-relaxed text-neutral-300 font-light">
          {systemCopy.outro.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

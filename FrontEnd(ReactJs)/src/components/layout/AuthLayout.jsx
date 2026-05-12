import { BrandLogo } from "../ui/index.jsx";

function Blob({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  );
}

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-teal-50/40 to-emerald-50 relative overflow-hidden flex">
      <Blob className="w-96 h-96 bg-brand-300 -top-20 -left-20" />
      <Blob className="w-64 h-64 bg-teal-300 bottom-10 right-10" />
      <Blob className="w-48 h-48 bg-emerald-200 top-1/2 left-1/3" />

      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-center items-center p-12 relative">
        <div className="max-w-sm text-center space-y-6 animate-fade-in">
          <BrandLogo size="lg" />
          <p className="font-display text-3xl xl:text-4xl font-semibold text-brand-900 leading-snug">
            Học tiếng Anh{" "}
            <em className="not-italic text-teal-600">thông minh</em> với
            flashcard
          </p>
          <p className="text-gray-600 leading-relaxed">
            Ghi nhớ từ vựng hiệu quả hơn với phương pháp lặp lại ngắt quãng —
            được khoa học chứng minh.
          </p>

          <div className="relative flex justify-center mt-8 animate-float">
            <div className="w-52 h-32 bg-white rounded-2xl shadow-2xl border border-brand-100 flex flex-col items-center justify-center gap-2 rotate-3">
              <span className="text-3xl">🌟</span>
              <span className="font-display font-semibold text-brand-800 text-lg">
                ambiguous
              </span>
              <span className="text-sm text-gray-500 italic">
                / æmˈbɪɡjuəs /
              </span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-52 h-32 bg-gradient-to-br from-teal-400 to-brand-400 rounded-2xl -rotate-6 opacity-30" />
          </div>

          <div className="flex gap-6 justify-center pt-4">
            {[
              ["10k+", "Từ vựng"],
              ["95%", "Ghi nhớ"],
              ["30 ngày", "Hoàn thành"],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-xl text-brand-700">
                  {val}
                </div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
        <div className="lg:hidden mb-6">
          <BrandLogo />
        </div>
        {children}
      </div>
    </div>
  );
}

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
    <header className="flex justify-between items-center mb-16">
      <div className="animate-fadeIn">
        <h2 className="text-xl font-semibold">
          IES-Las-Galletas-DAW-2025-Grupo-D
        </h2>
      </div>
      <div className="animate-fadeIn delay-200">
        <div className="px-4 py-2 border rounded-md  inline-flex items-center">
          <span className="w-2 h-2  rounded-full mr-2 animate-pulse-slow"></span>
          Frontend Online
        </div>
      </div>
    </header>

    <main>{children}</main>
    </>
  );
}
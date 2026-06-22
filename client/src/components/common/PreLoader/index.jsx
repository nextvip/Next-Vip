import BrandLogo from "../BrandLogo";

export default function PreLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <BrandLogo link={false} size="default" />
        <div className="h-1 w-24 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-violet-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

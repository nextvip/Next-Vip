import BrandLogo from "../BrandLogo";
import { LoadingDots } from "../LoadingState";

export default function PreLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50/60">
      <div className="flex flex-col items-center gap-5">
        <BrandLogo link={false} size="default" />
        <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
          Loading
          <LoadingDots />
        </p>
      </div>
    </div>
  );
}

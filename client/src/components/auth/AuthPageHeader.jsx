export default function AuthPageHeader({ icon: Icon, title, description }) {
  return (
    <div className="text-center mb-6 space-y-3">
      {Icon && (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
          <Icon className="h-7 w-7 text-violet-600" />
        </div>
      )}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {description && (
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}

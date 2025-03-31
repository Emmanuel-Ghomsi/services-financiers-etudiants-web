import { Logo } from "@/components/layout/logo"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-blue">
      <Logo />
      <div className="mt-8 flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-t-brand-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div
            className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-transparent border-r-transparent border-b-brand-green border-l-transparent animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <p className="mt-4 text-lg font-medium text-brand-blue">Chargement en cours...</p>
      </div>
    </div>
  )
}


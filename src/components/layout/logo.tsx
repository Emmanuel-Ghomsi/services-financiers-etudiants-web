import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/images/logo.png" alt="Services Financiers Étudiants" width={80} height={80} className="w-20 h-20" />
      <div className="flex flex-col">
        <span className="text-xs uppercase font-semibold text-brand-blue">Services Financiers</span>
        <span className="text-lg uppercase font-bold text-brand-blue">Étudiants</span>
      </div>
    </Link>
  )
}


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getImageUrl } from "@/lib/utils/media-utils"
import { cn } from "@/lib/utils"

interface ProfileImageProps {
  src: string | null | undefined
  alt?: string
  fallback?: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  withCacheBusting?: boolean
}

// Modifier la fonction ProfileImage pour éviter les re-rendus infinis
export function ProfileImage({
  src,
  alt = "",
  fallback = "",
  className,
  size = "md",
  withCacheBusting = true,
}: ProfileImageProps) {
  // Déterminer la taille de l'avatar
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-32 w-32",
  }

  // Construire l'URL de l'image
  // Utiliser useRef et useEffect pour éviter les re-rendus infinis
  const imageUrl = src ? getImageUrl(src) : "/placeholder-profile.png"

  // Ne pas générer une nouvelle URL à chaque rendu si withCacheBusting est activé
  // Au lieu de cela, utiliser une URL statique avec un timestamp fixe
  const finalUrl =
    withCacheBusting && imageUrl
      ? `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}t=${Date.now().toString().slice(0, 8)}`
      : imageUrl

  // Générer le fallback (initiales) si non fourni
  const initials = fallback || (alt ? alt.charAt(0).toUpperCase() : "U")

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={finalUrl} alt={alt} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

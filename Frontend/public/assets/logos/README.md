# 🎨 Guide d'Intégration du Logo OccazCar

## 📁 Structure des fichiers

Placez vos fichiers de logo dans ce dossier avec les noms suivants :

```
public/assets/logos/
├── logo.png          # Logo principal (recommandé: 200x200px)
├── logo.svg          # Logo vectoriel (optionnel)
├── logo-white.png    # Logo blanc pour fond sombre
├── logo-dark.png     # Logo sombre pour fond clair
├── favicon.ico       # Favicon (16x16, 32x32, 48x48px)
└── apple-touch-icon.png # Icône Apple (180x180px)
```

## 🔧 Comment intégrer votre logo

### Option 1: Image PNG/JPG
1. Placez votre fichier `logo.png` dans ce dossier
2. Modifiez le fichier `src/components/ui/logo.tsx`
3. Décommentez la section "Option 1" et commentez les autres

```tsx
// Dans logo.tsx, ligne ~25
<img 
  src="/assets/logos/logo.png" 
  alt="OccazCar Logo" 
  className="h-full w-full object-contain"
/>
```

### Option 2: Logo SVG
1. Placez votre fichier `logo.svg` dans ce dossier
2. Modifiez le fichier `src/components/ui/logo.tsx`
3. Décommentez la section "Option 2" et remplacez le path SVG

```tsx
// Dans logo.tsx, ligne ~35
<svg 
  className={cn("h-5 w-5", variantClasses[variant])}
  viewBox="0 0 24 24" 
  fill="currentColor"
>
  <path d="Votre SVG path ici" />
</svg>
```

### Option 3: Logo avec texte intégré
Si votre logo inclut déjà le texte "OccazCar", modifiez le composant :

```tsx
// Dans logo.tsx
export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src="/assets/logos/logo-complet.png" 
        alt="OccazCar" 
        className={cn(
          size === "sm" ? "h-8" : size === "md" ? "h-10" : "h-12"
        )}
      />
    </div>
  );
}
```

## 🎯 Tailles recommandées

- **Navbar** : 32x32px (size="md")
- **Footer** : 32x32px (size="md") 
- **Pages Login/Register** : 48x48px (size="lg")
- **Favicon** : 16x16, 32x32, 48x48px
- **Apple Touch Icon** : 180x180px

## 🌈 Variantes de couleur

Le composant Logo supporte 3 variantes :
- `default` : Couleur primaire du thème
- `white` : Blanc (pour fond sombre)
- `primary` : Couleur primaire

```tsx
<Logo variant="white" /> // Pour fond sombre
<Logo variant="primary" /> // Couleur primaire
```

## 📱 Responsive

Le logo s'adapte automatiquement :
- **Mobile** : Taille réduite
- **Desktop** : Taille normale
- **Tablet** : Taille intermédiaire

## ✅ Test

Après avoir ajouté votre logo, testez sur :
- [ ] Page d'accueil (navbar)
- [ ] Page de connexion
- [ ] Page d'inscription  
- [ ] Footer
- [ ] Mode sombre/clair
- [ ] Mobile/Desktop

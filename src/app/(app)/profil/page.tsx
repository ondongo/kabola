import type { Metadata } from "next";
import { Suspense } from "react";
import {
  FiUser,
  FiCreditCard,
  FiLock,
  FiBell,
  FiHelpCircle,
  FiMessageCircle,
  FiLogOut,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiShield,
  FiCheck,
} from "react-icons/fi";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Skeleton from "@/components/atoms/Skeleton";
import { formatPrice } from "@/utils/format";

export const metadata: Metadata = {
  title: "Mon profil",
};

function ProfileHeader() {
  return (
    <div className="surface-hero-dark rounded-2xl p-6 text-white text-center">
      <div className="relative mx-auto mb-3 h-20 w-20">
        <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
          A
        </div>
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-success flex items-center justify-center">
          <FiCheck size={14} className="text-white" />
        </div>
      </div>
      <h1 className="text-xl font-bold">Alex Rivers</h1>
      <p className="text-sm text-white/70">Membre depuis Oct 2024</p>
    </div>
  );
}

function TrustScoreCard() {
  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-text-secondary">Score de confiance</p>
          <p className="text-3xl font-bold text-text">
            98 <span className="text-lg text-text-muted">/ 100</span>
          </p>
        </div>
        <div className="h-16 w-16 rounded-full border-4 border-success flex items-center justify-center">
          <span className="text-lg font-bold text-success">98</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-lg font-bold text-text">12</p>
          <p className="text-xs text-text-muted">Groupes</p>
        </div>
        <div>
          <p className="text-lg font-bold text-text">4.9</p>
          <p className="text-xs text-text-muted">Note</p>
        </div>
        <div>
          <p className="text-lg font-bold text-success">
            {formatPrice(540000)}
          </p>
          <p className="text-xs text-text-muted">Économisé</p>
        </div>
      </div>
    </Card>
  );
}

function AchievementBanner() {
  return (
    <Card className="flex items-center gap-3 bg-gray-50 border-none" padding="md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-light text-warning">
        <FiShield size={20} />
      </div>
      <div>
        <p className="text-sm font-semibold text-text">Super Partageur !</p>
        <p className="text-xs text-text-secondary">
          Votre score élevé vous permet de rejoindre les groupes premium plus
          rapidement.
        </p>
      </div>
    </Card>
  );
}

function VerificationStatus() {
  const items = [
    { icon: <FiCheck size={16} />, label: "Identité vérifiée", verified: true },
    { icon: <FiMail size={16} />, label: "Email vérifié", verified: true },
    { icon: <FiPhone size={16} />, label: "Téléphone vérifié", verified: true },
    { icon: <FiCreditCard size={16} />, label: "Compte bancaire lié", verified: true },
  ];

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">
        Vérification
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl bg-success-light/50 px-4 py-3"
          >
            <span className="text-success">{item.icon}</span>
            <span className="text-sm font-medium text-text">{item.label}</span>
            <Badge variant="success" className="ml-auto">
              Vérifié
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountSettings() {
  const items = [
    {
      icon: <FiUser size={18} />,
      label: "Informations personnelles",
      sublabel: "Nom, email et bio",
      color: "text-primary",
    },
    {
      icon: <FiCreditCard size={18} />,
      label: "Moyens de paiement",
      sublabel: "Wave ••••42",
      color: "text-success",
    },
    {
      icon: <FiLock size={18} />,
      label: "Sécurité & Confidentialité",
      sublabel: "2FA, Mots de passe",
      color: "text-warning",
    },
    {
      icon: <FiBell size={18} />,
      label: "Notifications",
      sublabel: "Email et Push",
      color: "text-primary",
    },
  ];

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">
        Paramètres du compte
      </h2>
      <Card padding="none" className="divide-y divide-border">
        {items.map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center gap-3 px-4 py-3.5 hover:bg-surface transition-colors first:rounded-t-2xl last:rounded-b-2xl"
          >
            <span className={item.color}>{item.icon}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text">{item.label}</p>
              <p className="text-xs text-text-muted">{item.sublabel}</p>
            </div>
            <FiChevronRight size={16} className="text-text-muted" />
          </button>
        ))}
      </Card>
    </div>
  );
}

function SupportSection() {
  const items = [
    { icon: <FiHelpCircle size={18} />, label: "Centre d'aide", sublabel: "FAQ et guides" },
    { icon: <FiMessageCircle size={18} />, label: "Contacter Kabola", sublabel: "Nous sommes là pour vous" },
  ];

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wider">
        Support
      </h2>
      <Card padding="none" className="divide-y divide-border">
        {items.map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center gap-3 px-4 py-3.5 hover:bg-surface transition-colors first:rounded-t-2xl last:rounded-b-2xl"
          >
            <span className="text-text-secondary">{item.icon}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text">{item.label}</p>
              <p className="text-xs text-text-muted">{item.sublabel}</p>
            </div>
            <FiChevronRight size={16} className="text-text-muted" />
          </button>
        ))}
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-5 px-4 py-6">
      <Skeleton className="h-44 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-16 rounded-2xl" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-14 rounded-xl" />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        <ProfileHeader />
        <TrustScoreCard />
        <AchievementBanner />
        <VerificationStatus />
        <AccountSettings />
        <SupportSection />

        <button className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-danger hover:bg-danger-light transition-colors">
          <FiLogOut size={18} />
          Se déconnecter
        </button>
      </div>
    </Suspense>
  );
}

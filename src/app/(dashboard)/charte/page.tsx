import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME, ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Charte de confiance",
};

const ownerRules: { title: string; body: string }[] = [
  {
    title: "Être titulaire de l’abonnement",
    body: `Seul le propriétaire du compte peut proposer un partage. Nous pouvons vous demander une facture pour vérifier que l’offre est bien la vôtre.`,
  },
  {
    title: "Respecter les conditions de l’offre",
    body: `Vérifiez que votre forfait autorise le partage (nombre d’accès ou d’écrans, etc.) et qu’il correspond à ce que vous indiquez sur ${APP_NAME}.`,
  },
  {
    title: "Prix équitable, sans marge commerciale",
    body: `Le montant demandé par place doit refléter le coût réel de l’abonnement dans votre pays, sans profit caché.`,
  },
  {
    title: "Engagement d’au moins 30 jours",
    body: `Les personnes qui rejoignent votre groupe doivent pouvoir utiliser le service pendant au moins 30 jours calendaires. En cas d’arrêt anticipé, les règles de paiement et d’annulation de ${APP_NAME} s’appliquent.`,
  },
  {
    title: "Périodes d’essai",
    body: `Un essai gratuit ne peut être partagé que s’il est suivi d’un abonnement payant. Il est interdit d’enchaîner uniquement des essais gratuits.`,
  },
  {
    title: "Sécurité des accès",
    body: `Les identifiants et liens d’invitation doivent être échangés via ${APP_NAME} (messages, et outils prévus à cet effet), et non en dehors de la plateforme.`,
  },
  {
    title: "Nombre de places réel",
    body: `Ne proposez pas plus de places que ce que votre abonnement permet réellement.`,
  },
];

const messageRules: { title: string; body: string }[] = [
  {
    title: "Courtoisie",
    body: `Restez poli et respectueux. Les insultes, menaces ou harcèlement sont interdits.`,
  },
  {
    title: `Paiements sur ${APP_NAME}`,
    body: `N’utilisez pas les messages pour demander un paiement en dehors de ${APP_NAME} ou sur une autre application.`,
  },
  {
    title: "Vie privée",
    body: `Ne sollicitez pas d’informations personnelles inutiles (adresse, téléphone, réseaux sociaux) dans un but qui dépasse le partage de l’abonnement.`,
  },
  {
    title: "Horaires raisonnables",
    body: `Évitez d’envoyer des messages à des heures très tardives ou très tôt. Si l’autre personne ne répond pas tout de suite, attendez avec patience.`,
  },
  {
    title: "Discrimination interdite",
    body: `Aucune remarque ou comportement discriminatoire (origine, genre, religion, orientation, handicap, etc.) n’est accepté.`,
  },
];

export default function CharterPage() {
  return (
    <div className="relative mx-auto max-w-2xl px-4 py-10">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-primary-light/80 to-transparent"
        aria-hidden
      />

      <Link
        href={ROUTES.CREATE_SUBSCRIPTION}
        className="relative inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-primary-light/50"
      >
        ← Retour à la création
      </Link>

      <header className="relative mt-8">
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          Charte de confiance {APP_NAME}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Le partage d’abonnements doit rester simple et honnête. Cette charte rappelle
          les règles pour les personnes qui hébergent un groupe et pour celles qui
          échangent dans les messages.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Trois principes : bienveillance, transparence, respect mutuel.
        </p>
      </header>

      <section className="relative mt-10 rounded-2xl border border-primary/15 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-dark-brand">
          Propriétaire de l’abonnement
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Si vous proposez un partage sur {APP_NAME}, vous vous engagez notamment à :
        </p>
        <ul className="mt-5 space-y-4">
          {ownerRules.map((rule) => (
            <li key={rule.title} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <p className="font-semibold text-text">{rule.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {rule.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative mt-6 rounded-2xl border border-primary/15 bg-primary-light/25 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-dark-brand">Messages</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Pour que les échanges restent utiles et sûrs :
        </p>
        <ul className="mt-5 space-y-4">
          {messageRules.map((rule) => (
            <li key={rule.title} className="border-b border-border/80 pb-4 last:border-0 last:pb-0">
              <p className="font-semibold text-text">{rule.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {rule.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="relative mt-8 rounded-2xl bg-dark-brand px-5 py-6 text-center text-white">
        <p className="text-sm leading-relaxed text-white/95">
          En respectant cette charte, vous contribuez à une communauté de confiance
          sur {APP_NAME}.
        </p>
        <p className="mt-3 text-sm font-medium">L’équipe {APP_NAME}</p>
      </footer>
    </div>
  );
}

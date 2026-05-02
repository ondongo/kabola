import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

export default function MessagesIndexPage() {
  return (
    <div className="flex h-full min-h-[40vh] flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="max-w-sm text-sm text-text-secondary">
        Sélectionnez une conversation dans la liste à gauche, ou ouvrez les messages depuis la
        fiche d’un abonnement.
      </p>
    </div>
  );
}

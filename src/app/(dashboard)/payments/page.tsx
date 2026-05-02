import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import Link from "next/link";
import Card from "@/components/atoms/Card";
import { formatPrice } from "@/utils/format";
import { getSessionUid } from "@/lib/auth/session";
import { listPaymentsForUser } from "@/services/payment.service";
import { redirect } from "next/navigation";
import { ROUTES, buildLoginHref } from "@/constants";

export const metadata: Metadata = {
  title: "Paiements",
};

export default async function PaymentsPage() {
  const uid = await getSessionUid();
  if (!uid) redirect(buildLoginHref());

  const payments = await listPaymentsForUser(uid);

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Paiements</h1>
        <p className="text-sm text-text-secondary">
          Historique PayDunya — mobile money (Wave, Orange Money, Free Money) et carte.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">
          Moyens utilisés sur Kabola
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-semibold text-text-secondary">Wave</p>
            <p className="mt-1 text-[11px] text-text-muted">PayDunya · mobile money</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-semibold text-text-secondary">Orange Money</p>
            <p className="mt-1 text-[11px] text-text-muted">PayDunya · mobile money</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-semibold text-text-secondary">Free Money</p>
            <p className="mt-1 text-[11px] text-text-muted">PayDunya · mobile money</p>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {payments.length === 0 ? (
          <Card className="border-dashed py-12 text-center text-text-secondary">
            Aucun paiement pour le moment.{" "}
            <Link href={ROUTES.SUBSCRIPTIONS_BROWSE} className="font-semibold text-primary">
              Explorer les groupes
            </Link>
          </Card>
        ) : (
          payments.map((row) => {
            const p = row as Record<string, unknown> & { id: string };
            return (
            <Card key={String(p.id)} padding="md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">
                    {formatPrice(Number(p.amountXof ?? 0))}
                  </p>
                  <p className="text-xs text-text-muted">
                    {String(p.status ?? "")} · {String(p.id).slice(0, 8)}…
                  </p>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium capitalize text-text-secondary">
                  {String(p.status ?? "")}
                </span>
              </div>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

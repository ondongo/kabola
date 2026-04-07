"use client";

import Link from "next/link";
import { FiUsers } from "react-icons/fi";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import TrustScore from "@/components/atoms/TrustScore";
import ServiceIcon from "@/components/atoms/ServiceIcon";
import { formatPrice, getAvailableSlots } from "@/utils/format";
import { ROUTES } from "@/constants";
import type { SubscriptionCardData } from "@/types";

interface SubscriptionCardProps {
  subscription: SubscriptionCardData;
}

export default function SubscriptionCard({
  subscription,
}: SubscriptionCardProps) {
  const available = getAvailableSlots(
    subscription.totalSlots,
    subscription.filledSlots,
  );

  return (
    <Link href={ROUTES.SUBSCRIPTION_DETAIL(subscription.id)}>
      <Card hover variant="default" className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <ServiceIcon name={subscription.serviceName} size="lg" />
            <div>
              <h3 className="font-semibold text-text">{subscription.title}</h3>
              <p className="text-sm text-text-secondary">
                {subscription.serviceName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              {formatPrice(subscription.pricePerSlot)}
            </p>
            <p className="text-xs text-text-muted">/mois</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrustScore score={subscription.trustScore} size="sm" />
            {subscription.isVerified && (
              <Badge variant="success">Vérifié</Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <FiUsers className="text-text-muted" size={14} />
            <span className="text-text-secondary">
              {available} place{available > 1 ? "s" : ""} dispo
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

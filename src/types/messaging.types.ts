/** Résumé d’un fil pour la liste Messages (inbox). */
export type MessageThreadSummary = {
  subscriptionId: string;
  title: string;
  serviceName: string;
  category: string;
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: Date | null;
  } | null;
  unread: boolean;
  /** Pour tri (activité récente) */
  sortKeyMs: number;
};

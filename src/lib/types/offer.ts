export type OfferDoc = {
  id?: string;
  type: "work" | "collaboration";
  name: string;
  email: string;
  message: string;
  projectId?: string;
  createdAt?: number;
  status: "new" | "responded" | "archived";
  responseHistory?: Array<{
    at: number;
    to: string;
    subject: string;
    body: string;
  }>;
};



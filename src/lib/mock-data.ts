export const kpis: {
  name: string;
  target: number;
  actual: number;
  group: string;
  currency?: boolean;
}[] = [];

export const funnel: { stage: string; count: number }[] = [];

export const regionData: { region: string; principals: number; meetings: number }[] = [];

export const outreachTimeline: {
  week: string;
  emails: number;
  linkedin: number;
  whatsapp: number;
}[] = [];

export type principal = {
  id: string;
  company: string;
  country: string;
  region: string;
  category: string;
  contact: string;
  email: string;
  priority: "A" | "B" | "C";
  status:
    | "Identified"
    | "Contacted"
    | "Responded"
    | "Meeting Set"
    | "Met"
    | "Negotiation"
    | "Won"
    | "Lost";
  score: number;
  meetingDate?: string;
  owner: string;
};

export const principals: principal[] = [];

export type Outreach = {
  id: string;
  date: string;
  company: string;
  contact: string;
  channel: "Email" | "LinkedIn" | "WhatsApp" | "Phone";
  campaign: string;
  outcome: "Sent" | "Opened" | "Replied" | "Meeting Booked" | "No Response";
};

export const outreach: Outreach[] = [];

export type Meeting = {
  id: string;
  date: string;
  time: string;
  company: string;
  attendee: string;
  objective: string;
  owner: string;
  outcome?: string;
  followUp?: string;
  priority: "A" | "B" | "C";
};

export const meetings: Meeting[] = [];

export type Opportunity = {
  id: string;
  company: string;
  country: string;
  region: string;
  type: "Distribution" | "Direct Manufacturing" | "Joint Venture" | "Toll Manufacturing";
  revenue: number;
  probability: number;
  stage: "Discovery" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
};

export const opportunities: Opportunity[] = [];

export const budget: { category: string; budget: number; actual: number }[] = [];

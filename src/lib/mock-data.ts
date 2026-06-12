// Mock data for the IFEAT 2026 Campaign Management Portal

export const kpis = [
  { name: "Principals Identified", target: 100, actual: 78, group: "Acquisition" },
  { name: "Tier A Principals", target: 20, actual: 14, group: "Acquisition" },
  { name: "Outreach Emails", target: 300, actual: 246, group: "Outreach" },
  { name: "LinkedIn Connections", target: 500, actual: 412, group: "Outreach" },
  { name: "Meeting Requests", target: 100, actual: 63, group: "Meetings" },
  { name: "Meetings Confirmed", target: 40, actual: 27, group: "Meetings" },
  { name: "Meetings Conducted", target: 40, actual: 11, group: "Meetings" },
  { name: "Qualified Opportunities", target: 20, actual: 9, group: "Pipeline" },
  { name: "Distribution Discussions", target: 5, actual: 3, group: "Pipeline" },
  { name: "Countries Covered", target: 10, actual: 7, group: "Geography" },
  { name: "Post Event Opportunities", target: 20, actual: 0, group: "Pipeline" },
  { name: "Pipeline Value", target: 500000, actual: 312000, group: "Revenue", currency: true },
  { name: "Weighted Pipeline", target: 250000, actual: 148500, group: "Revenue", currency: true },
];

export const funnel = [
  { stage: "Identified", count: 78 },
  { stage: "Contacted", count: 54 },
  { stage: "Responded", count: 31 },
  { stage: "Meeting Confirmed", count: 27 },
  { stage: "Meeting Conducted", count: 11 },
  { stage: "Qualified", count: 9 },
  { stage: "Partnership", count: 3 },
];

export const regionData = [
  { region: "Europe", principals: 24, meetings: 8 },
  { region: "North America", principals: 16, meetings: 5 },
  { region: "South America", principals: 9, meetings: 3 },
  { region: "MENA", principals: 12, meetings: 4 },
  { region: "Asia Pacific", principals: 14, meetings: 6 },
  { region: "Africa", principals: 3, meetings: 1 },
];

export const outreachTimeline = [
  { week: "W-12", emails: 12, linkedin: 30, whatsapp: 4 },
  { week: "W-10", emails: 28, linkedin: 55, whatsapp: 9 },
  { week: "W-8", emails: 41, linkedin: 72, whatsapp: 14 },
  { week: "W-6", emails: 53, linkedin: 88, whatsapp: 22 },
  { week: "W-4", emails: 62, linkedin: 95, whatsapp: 28 },
  { week: "W-2", emails: 50, linkedin: 72, whatsapp: 31 },
];

export type Principal = {
  id: string;
  company: string;
  country: string;
  region: string;
  category: string;
  contact: string;
  email: string;
  priority: "A" | "B" | "C";
  status: "Identified" | "Contacted" | "Responded" | "Meeting Set" | "Met" | "Negotiation" | "Won" | "Lost";
  score: number;
  meetingDate?: string;
  owner: string;
};

export const principals: Principal[] = [
  { id: "P-001", company: "Robertet SA", country: "France", region: "Europe", category: "Naturals", contact: "Élise Martin", email: "e.martin@robertet.com", priority: "A", status: "Meeting Set", score: 92, meetingDate: "2026-10-06", owner: "A. Rawji" },
  { id: "P-002", company: "Mane Kancor", country: "India", region: "Asia Pacific", category: "Botanicals", contact: "Rohan Iyer", email: "rohan@manekancor.com", priority: "A", status: "Responded", score: 88, meetingDate: "2026-10-07", owner: "S. Verma" },
  { id: "P-003", company: "Berjé Inc.", country: "USA", region: "North America", category: "Aroma Chemicals", contact: "Marcus Klein", email: "marcus@berje.com", priority: "A", status: "Met", score: 95, meetingDate: "2026-10-05", owner: "A. Rawji" },
  { id: "P-004", company: "Citromax", country: "Argentina", region: "South America", category: "Citrus", contact: "Lucia Fernández", email: "lucia@citromax.com", priority: "B", status: "Contacted", score: 71, owner: "S. Verma" },
  { id: "P-005", company: "Indukern F&F", country: "Spain", region: "Europe", category: "Distribution", contact: "Pablo Vega", email: "p.vega@indukern.es", priority: "A", status: "Negotiation", score: 90, meetingDate: "2026-10-06", owner: "A. Rawji" },
  { id: "P-006", company: "Ventós", country: "Spain", region: "Europe", category: "Naturals", contact: "Anna Soler", email: "anna@ventos.com", priority: "B", status: "Identified", score: 64, owner: "M. Khan" },
  { id: "P-007", company: "Treatt PLC", country: "UK", region: "Europe", category: "Citrus", contact: "James Howard", email: "j.howard@treatt.com", priority: "A", status: "Responded", score: 86, meetingDate: "2026-10-08", owner: "A. Rawji" },
  { id: "P-008", company: "Ernesto Ventós", country: "Spain", region: "Europe", category: "Naturals", contact: "Marta Llopis", email: "marta@ventos.com", priority: "C", status: "Identified", score: 52, owner: "M. Khan" },
  { id: "P-009", company: "Penta Manufacturing", country: "USA", region: "North America", category: "Aroma Chemicals", contact: "David Nguyen", email: "d.nguyen@pentamfg.com", priority: "B", status: "Contacted", score: 68, owner: "S. Verma" },
  { id: "P-010", company: "Vigon International", country: "USA", region: "North America", category: "Aroma Chemicals", contact: "Sarah Patel", email: "sarah@vigon.com", priority: "B", status: "Responded", score: 74, meetingDate: "2026-10-07", owner: "S. Verma" },
  { id: "P-011", company: "Sensient Flavors", country: "USA", region: "North America", category: "Flavors", contact: "Greg Thomas", email: "g.thomas@sensient.com", priority: "A", status: "Meeting Set", score: 89, meetingDate: "2026-10-08", owner: "A. Rawji" },
  { id: "P-012", company: "Takasago", country: "Japan", region: "Asia Pacific", category: "Fragrance", contact: "Yuki Tanaka", email: "y.tanaka@takasago.com", priority: "A", status: "Responded", score: 91, owner: "A. Rawji" },
  { id: "P-013", company: "Adani Wilmar", country: "India", region: "Asia Pacific", category: "Carriers", contact: "Vikram Shah", email: "v.shah@adaniwilmar.in", priority: "C", status: "Identified", score: 48, owner: "M. Khan" },
  { id: "P-014", company: "DRT", country: "France", region: "Europe", category: "Pine Chemicals", contact: "Henri Dubois", email: "h.dubois@drt.fr", priority: "B", status: "Contacted", score: 70, owner: "S. Verma" },
  { id: "P-015", company: "Privi Speciality", country: "India", region: "Asia Pacific", category: "Aroma Chemicals", contact: "Neha Joshi", email: "neha@privi.com", priority: "A", status: "Won", score: 96, meetingDate: "2026-10-05", owner: "A. Rawji" },
];

export type Outreach = {
  id: string;
  date: string;
  company: string;
  contact: string;
  channel: "Email" | "LinkedIn" | "WhatsApp" | "Phone";
  campaign: string;
  outcome: "Sent" | "Opened" | "Replied" | "Meeting Booked" | "No Response";
};

export const outreach: Outreach[] = [
  { id: "O-1041", date: "2026-09-22", company: "Robertet SA", contact: "Élise Martin", channel: "Email", campaign: "Tier A Intro", outcome: "Meeting Booked" },
  { id: "O-1042", date: "2026-09-22", company: "Mane Kancor", contact: "Rohan Iyer", channel: "LinkedIn", campaign: "APAC Wave 2", outcome: "Replied" },
  { id: "O-1043", date: "2026-09-23", company: "Berjé Inc.", contact: "Marcus Klein", channel: "Email", campaign: "Tier A Intro", outcome: "Meeting Booked" },
  { id: "O-1044", date: "2026-09-23", company: "Citromax", contact: "Lucia Fernández", channel: "WhatsApp", campaign: "LATAM Push", outcome: "Opened" },
  { id: "O-1045", date: "2026-09-24", company: "Indukern F&F", contact: "Pablo Vega", channel: "Email", campaign: "Distribution Deep-Dive", outcome: "Replied" },
  { id: "O-1046", date: "2026-09-24", company: "Treatt PLC", contact: "James Howard", channel: "LinkedIn", campaign: "Citrus Specialists", outcome: "Replied" },
  { id: "O-1047", date: "2026-09-25", company: "Ventós", contact: "Anna Soler", channel: "Email", campaign: "EU Tier B", outcome: "Sent" },
  { id: "O-1048", date: "2026-09-25", company: "Penta Manufacturing", contact: "David Nguyen", channel: "Email", campaign: "NA Tier B", outcome: "Opened" },
  { id: "O-1049", date: "2026-09-26", company: "Takasago", contact: "Yuki Tanaka", channel: "LinkedIn", campaign: "APAC Tier A", outcome: "Replied" },
  { id: "O-1050", date: "2026-09-26", company: "Sensient Flavors", contact: "Greg Thomas", channel: "Email", campaign: "Flavors Vertical", outcome: "Meeting Booked" },
  { id: "O-1051", date: "2026-09-27", company: "Privi Speciality", contact: "Neha Joshi", channel: "WhatsApp", campaign: "APAC Tier A", outcome: "Meeting Booked" },
  { id: "O-1052", date: "2026-09-28", company: "Vigon International", contact: "Sarah Patel", channel: "Email", campaign: "NA Tier B", outcome: "Replied" },
  { id: "O-1053", date: "2026-09-28", company: "DRT", contact: "Henri Dubois", channel: "Email", campaign: "EU Pine Chems", outcome: "Opened" },
  { id: "O-1054", date: "2026-09-29", company: "Adani Wilmar", contact: "Vikram Shah", channel: "LinkedIn", campaign: "Carriers Outreach", outcome: "No Response" },
];

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

export const meetings: Meeting[] = [
  { id: "M-201", date: "2026-10-05", time: "09:30", company: "Berjé Inc.", attendee: "Marcus Klein", objective: "Aroma chemicals distribution in South Asia", owner: "A. Rawji", outcome: "Strong interest, NDA next week", followUp: "2026-10-12", priority: "A" },
  { id: "M-202", date: "2026-10-05", time: "11:00", company: "Privi Speciality", attendee: "Neha Joshi", objective: "Direct manufacturer agreement", owner: "A. Rawji", outcome: "Term sheet drafted", followUp: "2026-10-10", priority: "A" },
  { id: "M-203", date: "2026-10-06", time: "10:00", company: "Robertet SA", attendee: "Élise Martin", objective: "Naturals portfolio expansion", owner: "A. Rawji", priority: "A" },
  { id: "M-204", date: "2026-10-06", time: "14:30", company: "Indukern F&F", attendee: "Pablo Vega", objective: "Regional distributor handover", owner: "A. Rawji", priority: "A" },
  { id: "M-205", date: "2026-10-07", time: "09:00", company: "Mane Kancor", attendee: "Rohan Iyer", objective: "Botanicals supply expansion", owner: "S. Verma", priority: "A" },
  { id: "M-206", date: "2026-10-07", time: "15:00", company: "Vigon International", attendee: "Sarah Patel", objective: "US specialties partnership", owner: "S. Verma", priority: "B" },
  { id: "M-207", date: "2026-10-08", time: "10:30", company: "Treatt PLC", attendee: "James Howard", objective: "Citrus oils long-term contract", owner: "A. Rawji", priority: "A" },
  { id: "M-208", date: "2026-10-08", time: "13:00", company: "Sensient Flavors", attendee: "Greg Thomas", objective: "Flavors distribution APAC", owner: "A. Rawji", priority: "A" },
];

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

export const opportunities: Opportunity[] = [
  { id: "OPP-001", company: "Privi Speciality", country: "India", region: "Asia Pacific", type: "Direct Manufacturing", revenue: 120000, probability: 0.9, stage: "Closed Won" },
  { id: "OPP-002", company: "Berjé Inc.", country: "USA", region: "North America", type: "Distribution", revenue: 85000, probability: 0.7, stage: "Negotiation" },
  { id: "OPP-003", company: "Indukern F&F", country: "Spain", region: "Europe", type: "Distribution", revenue: 65000, probability: 0.65, stage: "Negotiation" },
  { id: "OPP-004", company: "Robertet SA", country: "France", region: "Europe", type: "Direct Manufacturing", revenue: 95000, probability: 0.5, stage: "Proposal" },
  { id: "OPP-005", company: "Mane Kancor", country: "India", region: "Asia Pacific", type: "Joint Venture", revenue: 140000, probability: 0.4, stage: "Qualified" },
  { id: "OPP-006", company: "Treatt PLC", country: "UK", region: "Europe", type: "Distribution", revenue: 72000, probability: 0.45, stage: "Qualified" },
  { id: "OPP-007", company: "Sensient Flavors", country: "USA", region: "North America", type: "Distribution", revenue: 58000, probability: 0.35, stage: "Discovery" },
  { id: "OPP-008", company: "Takasago", country: "Japan", region: "Asia Pacific", type: "Toll Manufacturing", revenue: 110000, probability: 0.3, stage: "Discovery" },
  { id: "OPP-009", company: "Citromax", country: "Argentina", region: "South America", type: "Distribution", revenue: 42000, probability: 0.25, stage: "Discovery" },
];

export const budget = [
  { category: "Booth & Build-out", budget: 45000, actual: 41200 },
  { category: "Travel & Lodging", budget: 22000, actual: 19500 },
  { category: "Hospitality & Dinners", budget: 18000, actual: 8400 },
  { category: "Marketing Collateral", budget: 9000, actual: 7600 },
  { category: "Pre-event Outreach", budget: 6000, actual: 5200 },
  { category: "Samples & Shipping", budget: 12000, actual: 9800 },
];

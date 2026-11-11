/**
 * DEMO leader-ID register for the Verify page. Names are withheld on purpose: the public check
 * confirms only role, state and status, never personal details. Production: a read-only lookup
 * against the approved-leader register.
 */
export type LeaderRecord = { id: string; role: "Ward leader" | "Street leader" | "Country coordinator"; area: string; status: "Active" | "Suspended" | "Expired" };

export const leaderRegister: LeaderRecord[] = [
  { id: "TBH-LDR-00042", role: "Ward leader", area: "Ikeja LGA, Lagos", status: "Active" },
  { id: "TBH-LDR-00117", role: "Street leader", area: "Nassarawa LGA, Kano", status: "Active" },
  { id: "TBH-LDR-00256", role: "Ward leader", area: "Enugu North LGA, Enugu", status: "Active" },
  { id: "TBH-LDR-00301", role: "Country coordinator", area: "United Kingdom", status: "Active" },
  { id: "TBH-LDR-00388", role: "Street leader", area: "Port Harcourt LGA, Rivers", status: "Suspended" },
  { id: "TBH-LDR-00419", role: "Street leader", area: "Ibadan North LGA, Oyo", status: "Expired" },
];

export const LEADER_ID_PATTERN = /^TBH-LDR-\d{5}$/;

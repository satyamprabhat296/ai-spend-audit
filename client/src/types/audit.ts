export type ToolEntry = {
  tool: string;
  plan: string;
  spend: number;
  seats: number;
};

export type AuditForm = {
  tools: ToolEntry[];
  teamSize: number;
  useCase: string;
};
export const calculateLeadScore = (lead) => {
  let score = 0;

  if (lead.email) score += 10;
  if (lead.phoneNumber) score += 10;

  if (lead.dealValue > 10000) score += 30;
  if (lead.leadSource === "Referral") score += 20;
  if (lead.status === "Qualified") score += 25;
  if (lead.tags?.includes("Hot")) score += 15;

  return score;
};

export const getPriority = (score) => {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};
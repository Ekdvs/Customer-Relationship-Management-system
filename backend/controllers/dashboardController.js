import Lead from "../models/leadModel.js";

export const getDashboard = async (request, response) => {
  try {
    const leads = await Lead.find();

    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === "New").length;
    const qualified = leads.filter(l => l.status === "Qualified").length;
    const won = leads.filter(l => l.status === "Won").length;
    const lost = leads.filter(l => l.status === "Lost").length;

    const totalDealValue = leads.reduce(
      (sum, l) => sum + (l.dealValue || 0),
      0
    );

    const wonDealValue = leads
      .filter(l => l.status === "Won")
      .reduce((sum, l) => sum + (l.dealValue || 0), 0);

    const conversionRate =
      totalLeads === 0 ? 0 : (won / totalLeads) * 100;

    const avgDealValue =
      totalLeads === 0 ? 0 : totalDealValue / totalLeads;

    response.json({
      totalLeads,
      newLeads,
      qualified,
      won,
      lost,
      totalDealValue,
      wonDealValue,
      conversionRate: conversionRate.toFixed(2),
      avgDealValue: avgDealValue.toFixed(2),
    });
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
};
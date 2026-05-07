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

// Returns per-salesperson stats for the Admin dashboard table
export const getSalesPerformance = async (request, response) => {
  try {
    const salesUsers = await User.find({ role: "Sales" });
 
    const performance = await Promise.all(
      salesUsers.map(async (user) => {
        const userLeads = await Lead.find({ assignedTo: user._id });
        const totalLeads = userLeads.length;
        const wonLeads = userLeads.filter((l) => l.status === "Won").length;
        const lostLeads = userLeads.filter((l) => l.status === "Lost").length;
        const revenue = userLeads
          .filter((l) => l.status === "Won")
          .reduce((sum, l) => sum + (l.dealValue || 0), 0);
        const conversionRate =
          totalLeads === 0
            ? "0.00"
            : ((wonLeads / totalLeads) * 100).toFixed(2);
 
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          totalLeads,
          wonLeads,
          lostLeads,
          revenue,
          conversionRate,
        };
      })
    );
 
    return response.status(200).json({
      message: "Sales performance fetched successfully",
      data: performance,
      error: false,
      success: true,
    });
  } catch (err) {
    return response.status(500).json({ message: err.message });
  }
};
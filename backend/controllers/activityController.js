import Activity from "../models/activity";

//get activity by lead id
export const getActivityByLeadId = async (request, response) => { 
    try {
        const leadId = request.params.leadId;
        const activities = await Activity.find({ lead: leadId }).populate("createdBy", "name email");
        return response.status(200).json(
            {
                message: "Activities fetched successfully",
                data: activities,
                error: false,
                success: true
            }
        );
    } catch (error) {
        return response.status(500).json(
            {
                message: "Error fetching activities" ,
                error: true,
                success: false
            }
        );
    }
}

//get all activities
export const getAllActivities = async (request, response) => {
    try {
        const activities = await Activity.find().populate("createdBy", "name email");
        return response.status(200).json(
            {
                message: "Activities fetched successfully",
                data: activities,
                error: false,
                success: true
            }
        );
    } catch (error) {
        return response.status(500).json(
            {
                message: "Error fetching activities" ,
                error: true,
                success: false
            }
        );
    }
}
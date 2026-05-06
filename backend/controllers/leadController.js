
import Activity from "../models/activity.js";
import Lead from "../models/leadModel.js";
import User from "../models/userModel.js";
import { assignLeadToUser } from "../services/assignmentService.js";
import { calculateLeadScore, getPriority } from "../services/leadScoringService.js";


//create lead
export const createLead = async (request, response) => {
    try {
        const { leadName,email,phoneNumber ,companyName} = request.body;

        if (!leadName || !email || !phoneNumber || !companyName) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "Please provide all required fields"
            });
        }

        const users = await User.find({ role: "Sales" });

        if(users.length === 0) {
            return response.status(400).json({
                success: false,
                error: true,
                message: "No sales users available to assign the lead"
            });
        }

        const assignedTo = users.length > 0 ? assignLeadToUser(users) : null;

        const score = calculateLeadScore(request.body);
        const priority =getPriority(score);

        const lead = await Lead.create({
            ...request.body,
            assignedTo,
            score,
            priority
        });

        await Activity.create(
            {
                lead: lead._id,
                message: `Lead created and assigned to ${assignedTo ? assignedTo.name : "no one"}`,
                type: "lead_created",
                createdBy: request.userId
            }
        )

        return response.status(201).json(
            {
                message: "Lead created successfully",
                data: lead,
                error: false,
                success: true
            }
        )
        
    } catch (error) {
        return response.status(500).json(
            { 
                message: "Error creating lead" ,
                error: true,
                success: false
            }
        );
    }
}

//get all leads (fitter +search +sortby score)
export const getLeads = async (request, response) => {
    try {
        const{status,source,priority,search} = request.query;
        let filter = {};

        if(status) filter.status = status;
        if(source) filter.leadSource = source;
        if(priority) filter.priority = priority;

        if(search){
            filter.$or = [
                { leadName: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                
            ];
        }

        const leads = await Lead.find(filter).populate("assignedTo","name email").sort({score:-1});

        return response.status(200).json(
            {
                message: "Leads fetched successfully",
                data: leads,
                error: false,
                success: true
            }
        );
        
    } catch (error) {
        return response.status(500).json(
            { 
                message: "Error fetching leads" ,
                error: true,
                success: false
            }
        );
    }
}

//update lead
export const updateLead = async (request, response) => {
    try {
        const leadId = request.params.id;
        const lead = await Lead.findById(leadId);

        if(!lead){
            return response.status(404).json(
                {
                    message: "Lead not found",
                    error: true,
                    success: false
                }
            );
        }

        const updatedData = request.body;
        await Activity.create(
            {
                lead: lead._id,
                message: `Lead updated with data: ${JSON.stringify(updatedData)}`,
                type: "lead_updated",
                createdBy: request.userId
            }
        )

        if(updatedData.status && updatedData.status !== lead.status){
            await Activity.create(
                {
                    lead: lead._id,
                    message: `Lead status changed from ${lead.status} to ${updatedData.status}`,
                    type: "status_changed",
                    createdBy: request.userId
                }
            )
        }

        const updatedLead = await Lead.findByIdAndUpdate(leadId, updatedData, { new: true });

        return response.status(200).json(
            {
                message: "Lead updated successfully",
                data: updatedLead,
                error: false,
                success: true
            }
        );
        
    } catch (error) {
        return response.status(500).json(
            { 
                message: "Error updating lead" ,
                error: true,
                success: false
            }
        );
        
    }
}

//delete lead
export const deleteLead = async (request, response) => {
    try {
        const leadId = request.params.id;
        const lead = await Lead.findById(leadId);

        if(!lead){
            return response.status(404).json(
                {
                    message: "Lead not found",
                    error: true,
                    success: false
                }
            );
        }

        await Activity.create(
            {
                lead: lead._id,
                message: "Lead deleted",
                type: "lead_deleted",
                createdBy: request.userId
            }
        )

        await Lead.findByIdAndDelete(leadId);

        return response.status(200).json(
            {
                message: "Lead deleted successfully",
                error: false,
                success: true
            }
        );
        
    } catch (error) {
        return response.status(500).json(
            { 
                message: "Error deleting lead" ,
                error: true,
                success: false
            }
        );
    }
}

//get lead by id
export const getLeadById = async (request, response) => {
    try {
        const leadId = request.params.id;
        const lead = await Lead.findById(leadId).populate("assignedTo","name email").populate("notes").populate("activities");
        if(!lead){
            return response.status(404).json(
                {
                    message: "Lead not found",
                    error: true,
                    success: false
                }
            );
        }

        return response.status(200).json(
            {
                message: "Lead fetched successfully",
                data: lead,
                error: false,
                success: true
            }
        );
    } catch (error) {
        return response.status(500).json(
            {
                message: "Error fetching lead" ,
                error: true,
                success: false
            }
        );
    }
}
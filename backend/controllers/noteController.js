import Activity from "../models/activity.js";
import Note from "../models/noteModel.js";

//create note
export const createNote = async (request, response) => {
    try {
        const { content, leadId, type } = request.body;

        if (!content || !leadId) {
            return response.status(400).json(
                {
                    message: "Please provide content and leadId",
                    error: true,
                    success: false
                }
            );
        }

        const note = await Note.create(
            {
                content,
                lead: leadId,
                createdBy: request.userId,
                type
            }
        )

        await Activity.create(
            {
                lead: leadId,
                message: "Note added",
                type: "note_added",
                createdBy: request.userId
            }
        )

        return response.status(201).json(
            {
                message: "Note created successfully",
                data: note,
                error: false,
                success: true
            }
        );
        
    } catch (error) {
        return response.status(500).json(
            { 
                message: "Error creating note" ,
                error: true,
                success: false
            }
        );
    }
}

//get notes by lead id
export const getNotesByLeadId = async (request, response) => {
    try {
        const leadId = request.params.leadId;
        const notes = await Note.find({ lead: leadId }).populate("createdBy", "name email");
        return response.status(200).json(
            {
                message: "Notes fetched successfully",
                data: notes,
                error: false,
                success: true
            }
        );
    } catch (error) {
        return response.status(500).json(
            {
                message: "Error fetching notes" ,
                error: true,
                success: false
            }
        );  
    }
}
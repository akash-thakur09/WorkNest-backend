import { createAnnouncement, getAllAnnouncements, getVisibleAnnouncements, deleteAnnouncement } from "../../controllers/announcement.controller";
import { Request, Response } from "express";

import AnnouncementModel from "../../models/Announcement.model";
import { error } from "console";

jest.mock('../../models/Announcement.model');

describe('Create announcement', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockJson: jest.Mock;
    beforeEach(() => {
        mockReq = {
            body: {
                title: 'Test Announcement',
                message: 'This is a test announcement',
                visibility: 'Employee',
                expiryDate: new Date(),
                userId: '60c72b2f9b1d8c001c8e4e1a'
            }
        };

        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockRes = {
            status: mockStatus,
            json: mockJson
        }
        jest.clearAllMocks();
    })

    it('Should return 201 and success message on create announcement', async () => {
        (AnnouncementModel.create as jest.Mock).mockResolvedValue({})

        await createAnnouncement(mockReq as Request, mockRes as Response);

        expect(mockStatus).toHaveBeenCalledWith(201);

        expect(mockJson).toHaveBeenCalledWith({
            message: 'Announcement created successfully',
            data: expect.objectContaining({})
        });

    })

    it('should handle server error and return 500', async () => {

        (AnnouncementModel.create as jest.Mock).mockRejectedValue(new Error('Server error'))

        await createAnnouncement(mockReq as Request, mockRes as Response)

        expect(mockStatus).toHaveBeenCalledWith(500)

        expect(mockJson).toHaveBeenCalledWith({
            message: 'Server error',
            error: expect.any(Error)
        });
    });
})
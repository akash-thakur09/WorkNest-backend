import { Request, Response, NextFunction } from 'express';
import { protect } from '../../middleware/auth.middleware';
import jwt from 'jsonwebtoken'
import UserModel from '../../models/User.model';
import { mock } from 'node:test';

jest.mock('jsonwebtoken')
jest.mock('../../models/User.model');

describe('Auth Middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let next: NextFunction;


    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        next = jest.fn();
        mockReq = {
            headers: {
                authorization: 'Bearer qwertyuioasdfgh1234567890'
            }
        }
        mockRes = {
            status: mockStatus
        }
        jest.clearAllMocks();
    })

    it('Should return 401 if no token is provided', async () => {
        mockReq.headers = {};
        await protect(mockReq as Request, mockRes as Response, next);
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ message: 'No token, access denied' });
        expect(next).not.toHaveBeenCalled();
    })

    it('Should return 401 if token is invalid', async () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        })

        await protect(mockReq as Request, mockRes as Response, next);
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    })

    xit('Should return 404 if user is not found', async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ employeeId: '12345' });
        (UserModel.findById as jest.Mock).mockResolvedValue(null);

        await protect(mockReq as Request, mockRes as Response, next);

        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ message: 'User not found' });
        expect(next).not.toHaveBeenCalled();
    });

});

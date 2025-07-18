import { deleteEmployee, updateEmployee } from '../../controllers/employee.controller';
import UserModel from '../../models/User.model';
import { Request, Response } from 'express';

// src/controllers/employee.controller.test.ts

jest.mock('../../models/User.model');

// Test suite for updateEmployee function
describe('updateEmployee', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      params: { id: 'test-id' },
      body: {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        role: 'Developer',
        departmentId: 'dept-id',
        managerId: 'mgr-id',
        profilePicUrl: 'pic-url'
      }
    };
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = {
      status: statusMock,
      json: jsonMock
    };
    jest.clearAllMocks();
  });

  it('should return 404 if employee not found', async () => {
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await updateEmployee(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Employee not found' });
  });

  it('should update employee and return 200 with updated user', async () => {
    const updatedUser = { _id: 'test-id', ...req.body };
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

    await updateEmployee(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Employee updated successfully',
      user: updatedUser
    });
  });

  it('should handle server error and return 500', async () => {
    (UserModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('DB error'));

    await updateEmployee(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Server error',
      error: expect.any(Error)
    });
  });
});

// Test suite for deleteEmployee function
describe('deleteEmployee', () =>{
    let req: Partial<Request> = {
        params: { id: 'test-id' }
    };
    let res: Partial<Response>;
    let statusMock: jest.Mock;  
    let jsonMock: jest.Mock;
    beforeEach(()=>{
        req = {
            params: { id: 'test-id' }
        };
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = {
            status: statusMock,
            json: jsonMock
        };
        jest.clearAllMocks();
    })

    it('should return 404 if employee not found', async ()=>{
        (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        await deleteEmployee(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ message: 'Employee not found' });
    })

    it('should delete employee and return 200 with deleted user', async ()=>{
        const deletedUser = { _id: 'test-id'};
        (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedUser);

        await deleteEmployee(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            message: 'Employee deleted successfully',
            user: deletedUser
        });
    })

    it('should handle server error and return 500', async () => {
        (UserModel.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error('DB error'));

        await deleteEmployee(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: 'Server error',
            error: expect.any(Error)
        });
    });
})
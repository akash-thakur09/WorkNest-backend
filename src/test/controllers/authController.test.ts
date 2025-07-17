import { registerEmployee } from '../../controllers/auth.controller';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../../models/User.model';
import { generateToken } from '../../utils/generateToken';

jest.mock('../../models/User.model');
jest.mock('bcryptjs');
jest.mock('../../utils/generateToken');

describe('registerEmployee', () => {
  const req = {
    body: {
      fullName: 'Akash Thakur',
      email: 'akash@example.com',
      password: 'secret123',
      role: 'employee',
      joiningDate: '2023-01-01',
    },
  } as Request;

  let res: Partial<Response>;

  const jsonMock = jest.fn();
  const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

  beforeEach(() => {
    res = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });

  it('should return 400 if any field is missing', async () => {
    const incompleteReq = { 
        body: { ...req.body, email: undefined } 
    } as Request;

    await registerEmployee(incompleteReq, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
  });

  it('should return 400 if user already exists', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(true);

    await registerEmployee(req, res as Response);

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('should create a user and return token and user data on success', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('s@lt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    const newUser = {
      _id: 'user123',
      fullName: req.body.fullName,
      email: req.body.email,
      role: req.body.role,
    };
    (UserModel.create as jest.Mock).mockResolvedValue(newUser);
    (generateToken as jest.Mock).mockReturnValue('mocked-token');

    await registerEmployee(req, res as Response);

    expect(UserModel.create).toHaveBeenCalledWith({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: 'hashedPassword',
      role: req.body.role,
      joiningDate: req.body.joiningDate,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      token: 'mocked-token',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  });

  it('should return 500 on unexpected error', async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('DB fail'));

    await registerEmployee(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
      error: expect.any(Error),
    });
  });
});
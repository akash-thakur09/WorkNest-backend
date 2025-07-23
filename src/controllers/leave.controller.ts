import { Request, Response } from 'express';
import LeaveModel from '../models/Leave.model';

// Leave controller for Employee { Apply, update, delete the leave request}

// Apply leave request
// POST /api/leave
export const applyLeave = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.employeeId; // from auth middleware
    const { fromDate, toDate, leaveType, reason } = req.body;
    
    const newLeave = await LeaveModel.create({
      employeeId: employeeId, // from auth middleware
      managerId: req.body.managerId, // assuming managerId is passed in the request body
      fromDate,
      toDate,
      leaveType,
      reason,
      status: 'Pending',
      appliedAt: new Date(),
    });

    res.status(201).json({
      message: 'Leave request submitted',
      leave: newLeave,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// update leave request{only date, leave type and reason of the leave requests}
// PUT /api/leave/:id
export const updateLeave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fromDate, toDate, leaveType, reason } = req.body;

    const updatedLeave = await LeaveModel.findByIdAndUpdate(
      id,
      { fromDate, toDate, leaveType, reason },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json({
      message: 'Leave request updated',
      leave: updatedLeave,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Delete leave request by Employee
// DELETE /api/leave/:id
export const deleteLeave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedLeave = await LeaveModel.findByIdAndDelete(id);

    if (!deletedLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json({ message: 'Leave request deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Get all leaves requested by an employee
// GET /api/leave/getMyLeaves/:employeeId 
export const getLeavesByEmployeeId = async (req: Request, res: Response) => {
  try {
    const employeeId = req.params.employeeId;

    const leaves = await LeaveModel.find({ employeeId })
      .populate('managerId', 'fullName email role')
      .sort({ appliedAt: -1 });

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ message: 'No leave requests found for this employee.' });
    }

    res.status(200).json({
      message: 'Leave requests fetched successfully',
      count: leaves.length,
      data: leaves,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


// Leave controller for Manager { get all leaves requested by employees under a manager, approve or reject leave requests}

// get all leaves which requested by all employee to a particular manager
// get /api/leave/manager/:managerId
export const getLeavesByManagerId = async (req: Request, res: Response) => {
  try {
    const { managerId } = req.params;
    
    const leaves = await LeaveModel.find({ managerId: managerId });
    
    res.status(200).json({
      message: 'Leave requests fetched',
      leaves,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Approve or reject leave request by Manager
// PUT /api/leave/:id/approve
export const approveLeaveByManager = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedLeave = await LeaveModel.findByIdAndUpdate(
      id,
      { status, updatedBy: req.body.employeeId },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json({
      message: 'Leave request updated',
      leave: updatedLeave,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// get all leaves requests for HR {rejected, approved, pending all}
// GET /api/leave/all-leave-requests
export const getAllLeaveRequestsByHR = async (_req: Request, res: Response) => {
  try {
    const leaves = await LeaveModel.find()
      .populate('employeeId', 'fullName email role')
      .populate('approvedBy', 'fullName email role')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      message: 'All leave requests fetched successfully',
      count: leaves.length,
      data: leaves,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};



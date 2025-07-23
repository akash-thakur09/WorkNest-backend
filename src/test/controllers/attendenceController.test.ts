// import { Request, Response } from "express";
// import AttendanceModel from "../../models/Attendance.model";
// import { markCheckIn, markCheckOut, getMyAttendance, getAllAttendance } from "../../controllers/attendance.controller";
// import moment from "moment";

// jest.mock('../../models/Attendance.model');

// describe('Mark Check-In Function', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;
//     let mockJson: jest.Mock;
//     let mockStatus: jest.Mock;

//     beforeEach(() => {
//         req = {
//             body: {
//                 userId: '12345qwerty12345',
//             }
//         }
//         mockJson = jest.fn();
//         mockStatus = jest.fn().mockReturnValue({ json: mockJson });
//         res = { 
//             status: mockStatus, 
//             json: mockJson 
//         };
//         jest.clearAllMocks();
//     })

//     it('Should return 400 if check-in already marked for today', async () => {
//         (AttendanceModel.findOne as jest.Mock).mockResolvedValue({ message: 'Check-in already marked for today.' });

//         await markCheckIn(req as Request, res as Response);

//         expect(mockStatus).toHaveBeenCalledWith(400);
//         expect(mockJson).toHaveBeenCalledWith({ message: 'Check-in already marked for today.' });
//     })

//     it('Should return 201 and attendance data on successful check-in', async () => {
//         (AttendanceModel.findOne as jest.Mock).mockResolvedValue(null);
//         (AttendanceModel.create as jest.Mock).mockResolvedValue({
//             employeeId: '12345qwerty12345',
//             date: moment().format('YYYY-MM-DD'),
//             checkIn: moment().format('HH:mm'),
//             status: 'Present',
//         })

//         await markCheckIn(req as Request, res as Response);

//         expect(mockStatus).toHaveBeenCalledWith(201);
//         expect(mockJson).toHaveBeenCalledWith(
//             {
//                 message: 'Check-in recorded',
//                 data: expect.objectContaining({
//                     employeeId: '12345qwerty12345',
//                     date: moment().format('YYYY-MM-DD'),
//                     checkIn: moment().format('HH:mm'),
//                     status: 'Present',
//                 })
//             }
//         );
//     })

//     it('Should return 500 on server error', async ()=>{
//         (AttendanceModel.findOne as jest.Mock).mockRejectedValue(new Error('Server error'));

//         await markCheckIn(req as Request, res as Response);

//         expect(mockStatus).toHaveBeenCalledWith(500);
//         expect(mockJson).toHaveBeenCalledWith({ message: 'Server error', error: expect.any(Error) });
//     })

// })
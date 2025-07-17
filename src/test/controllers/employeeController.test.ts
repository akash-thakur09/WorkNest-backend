// import { updateEmployee, deleteEmployee } from '../../controllers/employee.controller'
// import { Request, Response } from 'express';
// import UserModel from '../../models/User.model';

// jest.mock('../../models/User.model');


// describe('Employee Related all functionality', () => {
//     const req = {
//         body: {
//             fullName: 'Akash Thakur',
//             email: 'aksh@gmail.com',
//             phone: '1234567890',
//             role: 'Manager',
//             departmentId: '123-id',
//             managerId: 'managerId1234',
//             profilePicUrl: '1234qwerty'
//         }
//     }
//     let res: Partial<Response>;

//     const jsonMock = jest.fn();
//     const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

//     beforeEach(() => {
//         res = {
//             status: statusMock,
//             json: jsonMock,
//         };
//         jest.clearAllMocks();
//     });

//     it('should return 404 when employee not found ', async () => {

//         const id = '1234qwert123';
//         const updatedData = {
//             fullName: req.body.fullName,
//             email: req.body.email,
//             phone: req.body.phone,
//             role: req.body.role,
//             departmentId: req.body.departmentId,
//             managerId: req.body.managerId,
//             profilePicUrl: req.body.profilePicUrl,
//         };

//         (UserModel.findByIdAndUpdate() as jest.Mock).mockResolvedValue(true);
//         await updateEmployee(req, res as Response);



//     })

// })
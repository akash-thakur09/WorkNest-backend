import Jwt from "jsonwebtoken";

export const generateToken = (employeeId:string, role:string):string=>{
    const secret = process.env.JWT_SECRET_KEY as string
    return Jwt.sign({employeeId, role}, secret,{
        expiresIn:'7d'
    });
};
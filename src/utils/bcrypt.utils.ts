 import bcrypt from "bcryptjs";


 //hash password
 export const hashPassword = async (Password: string) => {
    try{

        //salt
        const salt = await bcrypt.genSalt(10);

        //hash
        const hash = await bcrypt.hash("password", salt);
        return hash;
    }catch (error){
        console.log(error);
        throw error;
    }
 };
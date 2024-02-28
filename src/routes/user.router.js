import express from 'express';
const router = express.Router();
import { prisma } from '../utils/prisma/index.js';
import Joi from 'joi';
import bcrypt from "bcrypt"
//회원 가입시 사용할 스키마 
const nicknameSchema = Joi.string().alphanum().min(3).max(15).required();
const passwordSchema = Joi.string().min(8).max(20).required();
const usertypeSchemma = Joi.string().valid('admin', 'user').required()

//sign-in router 작성
router.post("/sign-in", async(req, res,next)=> {
    try{
    let {nickname, password, usertype} = req.body
    if(! nickname||!password){
        return res.status(400).json({message:"데이터 형식이 올바르지 않습니다"})
    }
    const vaildation = nicknameSchema.validate(nickname)
    if(vaildation.error){
        return res
        .status(400)
        .json({ message: '닉네임 형식에 일치하지 않습니다.' });
    }
    const passwordvali = passwordSchema.validate(password)
    if(passwordvali.error){
        return res.status(400).json({message: "비밀번호 형식이 일치하지 않습니다"})
    }
    if(usertype){
    const usertypevali = usertypeSchemma.validate(usertype)
    if(usertypevali.error){
        return res.
        status(400)
        .json({ message: 'user type에는 OWNER 와 CUSTOMER만 존재합니다 이 두개중 골라 쓰시거나 쓰지않고 넘어가주세요'});

    }
}
    let findname = await prisma.Users.findFirst({
        where:{
            nickname:nickname
        }
    })
    if(findname){
        return res.status(409).json({message:"중복된 닉네임 입니다."})
    }
    let hashpassword = await bcrypt.hash(password,10)

    if(!usertype){
    let signuser = await prisma.Users.create({
      data: {
        nickname,
        password:hashpassword,
      },
    });
}
else{
   let signuser = await prisma.Users.create({
     data: {
       nickname,
       password:hashpassword,
       usertype,
     },
   });
}

return res.status(200).json({message:"회원가입이 완료되었습니다."})
    }catch(error){
        next(error)
    }
})

//sign-up router 작성

export default router;

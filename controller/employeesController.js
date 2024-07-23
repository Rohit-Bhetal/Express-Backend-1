const fs = require('fs');
const path = require('path');
require('dotenv').config;
const Employee = require('../model/Employee')


const getAllEmployees = async(req,res)=>{
    const employees = await Employee.find().exec();
    if(!employees) return res.status(204).json({
        'message': 'No employees'
    })

} 



const createNewEmployee= async(req,res) => {
    const {name,age,department,email}= req.body;

    if(!name || !age || !department || !email){
        return res.status(400).json({
            error:"Missing fields"
        })
    }
    try {
        const result = await Employee.create({
            name: name,
            age:age,
            department:department,
            email:email
        });
        res.status(200).json(result)
    } catch (error) {
        console.error(error);
    }
    
}

const updateEmployee= async (req,res)=>{
    const id = req.body.id;
    if(!id){
        return res.status(400).json({
            error:"Missing id"
        })
    }
    const employee = await Employee.findOne({
        _id:req.body.id
    }).exec();
    if (req.body.name) employee.name=req.body.name;
    if (req.body.age) employee.age=req.body.age;
    if (req.body.email) employee.email=req.body.email;
    if (req.body.department) employee.department=req.body.department;

    const result = await employee.save();
    result.json(result);
    
    
    
}

const deleteEmployee= async(req,res)=>{
    const id = req.body.id;
    if(!id){
        return res.status(400).json({
            error:"Missing id"
        })
    }
    const employee = await Employee.findOne({
        _id:req.body.id
    }).exec();
    
    const result = await employee.deleteOne({
        _id:req.body.id
    });

    res.json(result);

    
}

const getEmployee = async (req,res)=>{
    if(!req.params?.id) return res.status(400).json({
        'message':"Employee ID Required"
    });
    const employee = await Employee.findOne({
        _id:req.body.id
    }).exec();

    res.json(employee);
}

module.exports={
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}
const fs = require('fs');
const path = require('path');

const data = {};
data.employees=require('../data/employees.json');
const getAllEmployees =(req,res)=>{
    res.json(data.employees);
} 


const addNewEmployeeToJson=(newEmployee)=>{
   
        let users = data.employees;
        users.push(newEmployee);
        usersjson=JSON.stringify(users, null, 2);
        fs.writeFileSync(path.join(__dirname,'../data/employees.json'),usersjson,"utf-8");
    
}
const createNewEmployee=(req,res)=>{
    const {name,age,department,email}= req.body;

    if(!name || !age || !department || !email){
        return res.status(400).json({
            error:"Missing fields"
        })
    }
    let id=data.employees.length > 0 ? data.employees[data.employees.length - 1].id + 1 : 1;
    let newEmployee ={name,id,age,department,email};
    addNewEmployeeToJson(newEmployee);
    res.json(newEmployee);
}

const updateEmployee=(req,res)=>{
    const id = req.body.id;
    if(!id){
        return res.status(400).json({
            error:"Missing id"
        })
    }
    let usersdata=data.employees;
    
    let usersIndex= usersdata.findIndex(user=>user.id===id);
    if (usersIndex === -1) {
        return res.status(404).json({
            error: "Id not found"
        });
    }else{
        if (req.body.name) usersdata[usersIndex].name=req.body.name;
        if (req.body.age) usersdata[usersIndex].age=req.body.age;
        if (req.body.email) usersdata[usersIndex].email=req.body.email;
        if (req.body.department) usersdata[usersIndex].department=req.body.department;
        fs.writeFileSync(path.join(__dirname,'../data/employees.json'),JSON.stringify(usersdata, null, 2),"utf-8");
        res.status(200).json({
            "message": "Employee data updated successfully",
            "employee": usersdata[usersIndex]
        })
    }
    
    
}

const deleteEmployee=(req,res)=>{
    const id = req.body.id;
    if(!id){
        return res.status(400).json({
            error:"Missing id"
        })
    }
    let usersdata=data.employees;
    
    let newUsers= usersdata.filter(user=>user.id!==id);
    if (newUsers === null) {
        return res.status(404).json({
            error: "Id not found"
        });
    }else{
        fs.writeFileSync(path.join(__dirname,'../data/employees.json'),JSON.stringify(newUsers, null, 2),"utf-8");
        res.status(200).json({
            "message": "Employee data updated successfully"
        })
    }
    
}

const getEmployee = (req,res)=>{
    res.json({
        "id":req.params.id
    })
}

module.exports={
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}
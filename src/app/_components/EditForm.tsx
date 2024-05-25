import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Task } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar"

interface EditFormProps {
    setTasks: Dispatch<SetStateAction<Task[]>>;
    task:{
        description: string;
    title: string;
    id: string;
    status: string;
    dueDate: Date;
    }
  }

const EditForm:React.FC<EditFormProps> = ({task,setTasks}) => {
  const [title,setTitle] = useState<string>(task.title);
  const [description,setDescription] = useState<string>(task.description);
  const [status,setStatus] = useState<string>(task.status);
  const [date, setDate] = useState<Date>(task.dueDate);
  
  const handleEdit = (id:string, updatedTask:Task) => {
    fetch(`http://localhost:8000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    })
    .then(response => response.json())
    .then(data => {
        setTasks(prevTasks => prevTasks.map(task => (task.id === id ? data : task)));
        
    })
    .catch(error => console.error('Error updating task:', error));
    
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" >Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
           Create a new task here
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Eat"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Eat Dinner"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select onValueChange={(value) => setStatus(value)} >
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder={task.status} defaultValue={status}  />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pending" >pending</SelectItem>
    <SelectItem value="in-progress">in-progress</SelectItem>
    <SelectItem value="completed">completed</SelectItem>
  </SelectContent>
</Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due-date" className="text-right">
              Due Date
            </Label>
        
  
  
    
                <Calendar
                    mode="single"
                    selected={date}
                  onSelect={setDate}
                    className="rounded-md "
                    />
    


          </div>
        </div>
        <DialogFooter>
        <DialogTrigger asChild>

          <Button type="submit" onClick={()=>handleEdit(task.id,{
              id:task.id,
              title: title,
              description: description,
              status: status,
              dueDate:date
            })}>Edit</Button>
            </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditForm
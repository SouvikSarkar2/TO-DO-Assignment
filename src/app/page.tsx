
"use client"


import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import EditForm from "./_components/EditForm";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Calendar } from "@/components/ui/calendar"
import { Task } from "@/lib/types";
import { useRouter } from "next/navigation";
import ViewTask from "./_components/ViewTask";






export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title,setTitle] = useState<string>("");
  const [description,setDescription] = useState<string>("");
  const [status,setStatus] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  

  useEffect(() => {
    fetch('http://localhost:8000/tasks',{ cache: 'no-store' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json(); 
        })
        .then(data => {
            setTasks(data); 
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}, []);
// console.log("tasks : ",tasks)

const handleSubmit = () => {
  if (title === "" || description === "" || status === "") {
      return;
  }

 
  const task:Task = {
    id:Math.random().toString(),
      title: title,
      description: description,
      status: status,
      dueDate:date
  };

 
  fetch('http://localhost:8000/tasks ', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
  },)
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to add task');
      }
      return response.json();
  })
  .then(data => {
      tasks.push(data);
      console.log('Task added:', data);
      setTitle("");
      setDescription("");
      setStatus("");
      setDate(new Date());
      setTasks(tasks);
      
  })
  .catch(error => {
      console.error('Error adding task:', error);
  });

  
  
  
};

const handleDelete = (id:string) => {
  fetch(`http://localhost:8000/tasks/${id}`, {
      method: 'DELETE',
  })
  .then(response => {
      if (response.status === 204) {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      } else {
          console.error('Failed to delete task');
      }
  })
  .catch(error => console.error('Error deleting task:', error));
};





  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Tasks</h1>
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" >Create New Task</Button>
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
    <SelectValue placeholder="select here" />
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

          {(title !== "" && description !== "" && status !== "") && <Button type="submit" onClick={handleSubmit}>Create</Button>}
        </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            
                       
            {tasks.length!==0 && tasks.map((task,i)=><TableRow key={task.id}>
              <TableCell className="font-semibold">{task.title}</TableCell>
              <TableCell>
                <Badge variant={task.status === "pending" ? "destructive":"outline"} className={task.status==="completed" ? "bg-green-500 text-white":""} >{task.status}</Badge>
              </TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2"><EditForm setTasks={setTasks} task={task} />
                  
                  <Button  onClick={()=>handleDelete(task.id)}  size="sm" variant="destructive">
                    Delete
                  </Button>
                  <ViewTask id={task.id} key={task.id} />
                </div>
              </TableCell>
            </TableRow>)}
            
            
          </TableBody>
        </Table>
      </div>
        {tasks.length ===0 && <div className="flex h-[200px] justify-center items-center text-xl font-semibold">No Tasks</div>}
    </div>
  )
}
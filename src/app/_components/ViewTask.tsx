import { unstable_noStore as noStore } from "next/cache";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useEffect, useState } from "react";

  

const ViewTask = ({id}:{id:string}) => {
  const [title,setTitle] = useState<string>("");
  const [description,setDescription] = useState<string>("");


  useEffect(() => {
    noStore();
    fetch(`http://localhost:8000/tasks/${id}?refresh=true`,{ cache: 'no-store' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json(); 
        })
        .then(data => {
            setTitle(data.title);
            setDescription(data.description);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}, [id]);


  return (
    <Dialog>
    <DialogTrigger>
      
        <div className="p-2 border-2 text-white rounded-md bg-black">View</div>
     
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Title - {title}</DialogTitle>
        <DialogDescription>
          Description - {description}
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )
}

export default ViewTask
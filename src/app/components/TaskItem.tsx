"use client"
import { UniqueIdentifier } from "@dnd-kit/core";

const TaskItem = ({ id }: { id: UniqueIdentifier }) => {
    return (
        <div className="w-full h-[50px] flex items-center justify-center
         my-2.5 border border-gray-200 rounded-lg bg-white shadow-sm">
            {id}
        </div>
    );
};
export default TaskItem;
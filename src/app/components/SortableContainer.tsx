"use client"
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

const SortableContainer = ({
    id,
    items,
    label,
    color,
}: {
    id: string;
    items: string[];
    label: string;
    color: string;
}) => {
    const { setNodeRef } = useDroppable({
        id,
    });
    return (
        <div className="mx-1">
            <h3 className="mr-[70%] p-1 rounded-md text-sm  text-center text-gray-500 bg-gray-100">{label}</h3>
            <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
                <div
                    ref={setNodeRef}
                    className="w-full  border-gray-500/75 "
                >
                    {items.map((id: string) => (
                        <SortableItem key={id} id={id} />
                    ))}
                </div>
            </SortableContext>
            <div className="h-10 flex  px-3
            items-center  hover:bg-gray-50 rounded-md mb-2 text-gray-400">+ new</div>
        </div>
    );
};

export default SortableContainer;
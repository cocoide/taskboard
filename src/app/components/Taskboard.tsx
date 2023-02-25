"use client"
import React, { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    UniqueIdentifier,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableContainer from './SortableContainer';
import TaskItem from './TaskItem';

const Taskboard = () => {
    const [items, setItems] = useState<{
        [key: string]: string[];
    }>({
        todo: ["髪を切る", "課題をやる", "お水を買う"],
        doing: ["資格の勉強", "履修登録", "F"],
        done: ["G", "H", "I"],
    });
    const [activeId, setActiveId] = useState<UniqueIdentifier>();

    // ドラッグの開始、移動、終了などにどのような入力を許可するかを決めるprops
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = (id: UniqueIdentifier) => {
        if (id in items) {
            return id;
        }
        return Object.keys(items).find((key: string) =>
            items[key].includes(id.toString())
        );
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const id = active.id.toString();
        setActiveId(id);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const id = active.id.toString();
        const overId = over?.id;

        if (!overId) return;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(over?.id);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            // 配列のインデックス取得
            const activeIndex = activeItems.indexOf(id);
            const overIndex = overItems.indexOf(overId.toString());

            let newIndex;
            if (overId in prev) {
                // We're at the root droppable of a container
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem = over && overIndex === overItems.length - 1;

                const modifier = isBelowLastItem ? 1 : 0;

                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item !== active.id),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    items[activeContainer][activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                ],
            };
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const id = active.id.toString();
        const overId = over?.id;

        if (!overId) return;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(over?.id);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer !== overContainer
        ) {
            return;
        }

        // 配列のインデックス取得
        const activeIndex = items[activeContainer].indexOf(id);
        const overIndex = items[overContainer].indexOf(overId.toString());

        if (activeIndex !== overIndex) {
            setItems((items) => ({
                ...items,
                [overContainer]: arrayMove(
                    items[overContainer],
                    activeIndex,
                    overIndex
                ),
            }));
        }
        setActiveId(undefined);
    };

    return (
        <div className="flex flex-row mx-1">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                id={"dnd-context"}
            >
                <div className="grid grid-cols-2 md:grid-cols-3 justify-center w-full">
                    {/* SortableContainer */}
                    <SortableContainer
                        id="container1"
                        items={items.todo}
                        label="Todo"
                        color=''
                    />
                    <SortableContainer
                        id="container2"
                        label="Doing"
                        items={items.doing}
                        color=""
                    />
                    <SortableContainer
                        id="container3"
                        label="Done"
                        items={items.done}
                        color=""
                    />
                </div>
                <DragOverlay>{activeId ? <TaskItem id={activeId} /> : null}</DragOverlay>
            </DndContext>
        </div>
    );
};

export default Taskboard;
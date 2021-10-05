import { useCallback } from "react";
import { useState } from "react";

const tasksKey = "__MC_TASKS__";

export type TaskType = {
    name: string,
    description: string,
    lat: number,
    lng: number
}

type UseTaskValue = [ tasks : TaskType[] , addTask : (newTask : TaskType) => void ];

const useTasks = () : UseTaskValue => {
    const [ tasks, setTasks ] = useState<TaskType[]>( () => {
        try {
            let allTask = JSON.parse(tasksKey);
            if( !Array.isArray(allTask) ){
                allTask = [];
            }
            return allTask;
        }catch (err){
            return [];
        }

    });

    const addTask = useCallback( (newTask : TaskType) => {
        setTasks( oldTasks => {
            localStorage.setItem(
                tasksKey,
                JSON.stringify([...oldTasks, newTask ])
            );
            return [...oldTasks, newTask ] as TaskType[];
        });
    }, [setTasks]);

    return [ tasks, addTask ];
}

export { useTasks };
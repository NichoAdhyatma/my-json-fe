import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "../services/mutations";
import { useTodoIds, useTodos } from "../services/queries";
import { Todo } from "../types/todo";

export default function TodoComponent() {
  const todoIdsQuery = useTodoIds();
  const todoQueries = useTodos(todoIdsQuery.data);

  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const { register, handleSubmit } = useForm<Todo>();

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };

  const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
    if (data) updateTodoMutation.mutate({ ...data, checked: true });
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id);
    
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>New Todo : </h4>
        <input type="text" {...register("title")} placeholder="Title" />
        <br />
        <input
          type="text"
          {...register("description")}
          placeholder="Description"
        />
        <br />
        <input
          type="submit"
          disabled={createTodoMutation.isPending}
          value={createTodoMutation.isPending ? "Creating..." : "Create Todo"}
        />
      </form>

      <ul>
        {todoQueries.map(({ data }) => (
          <li key={data?.id}>
            <div>Id : {data?.id}</div>
            <span>
              <strong>Title : </strong> {data?.title},{" "}
              <strong>Description : </strong> {data?.description}
              <div>
                <button
                  onClick={() => handleMarkAsDoneSubmit(data)}
                  disabled={data?.checked}
                >
                  {data?.checked ? "Done" : "Mark as Done"}
                </button>
                <button onClick={() => handleDeleteTodo(data?.id!)}>
                  Delete
                </button>
              </div>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

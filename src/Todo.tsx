import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Todo = {
	id: string;
	title: string;
	status: "未着手" | "進行中" | "完了";
	detail: string;
};

export const TodoApp: React.FC = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [title, setTitle] = useState("");
	const [detail, setDetail] = useState("");
	const [status, setStatus] = useState<"未着手" | "進行中" | "完了">("未着手");
	const [filter, setFilter] = useState<Partial<Todo>>({});

	const addTodo = (): void => {
		const newTodo: Todo = {
			id: uuidv4(),
			title,
			status,
			detail,
		};
		setTodos([...todos, newTodo]);
		setTitle("");
		setDetail("");
		setStatus("未着手");
	};

	const deleteTodo = (id: string): void => {
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const editTodo = (id: string, updatedTodo: Partial<Todo>): void => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, ...updatedTodo } : todo,
			),
		);
	};

	const filteredTodos = todos.filter((todo) => {
		return (
			(!filter.id || todo.id.includes(filter.id)) &&
			(!filter.title || todo.title.includes(filter.title)) &&
			(!filter.status || todo.status === filter.status)
		);
	});

	return (
		<div>
			<h1>TODOリスト</h1>
			<div>
				<input
					type="text"
					placeholder="タイトル"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<input
					type="text"
					placeholder="詳細"
					value={detail}
					onChange={(e) => setDetail(e.target.value)}
				/>
				<select
					value={status}
					onChange={(e) =>
						setStatus(e.target.value as "未着手" | "進行中" | "完了")
					}
				>
					<option value="未着手">未着手</option>
					<option value="進行中">進行中</option>
					<option value="完了">完了</option>
				</select>
				<button type="button" onClick={addTodo}>
					追加
				</button>
			</div>
			<h2>フィルター</h2>
			<div>
				<input
					type="text"
					placeholder="IDで絞り込み"
					onChange={(e) => setFilter({ ...filter, id: e.target.value })}
				/>
				<input
					type="text"
					placeholder="タイトルで絞り込み"
					onChange={(e) => setFilter({ ...filter, title: e.target.value })}
				/>
				<select
					onChange={(e) =>
						setFilter({
							...filter,
							status: e.target.value as "未着手" | "進行中" | "完了",
						})
					}
				>
					<option value="">ステータスで絞り込み</option>
					<option value="未着手">未着手</option>
					<option value="進行中">進行中</option>
					<option value="完了">完了</option>
				</select>
			</div>
			<ul>
				{filteredTodos.map((todo) => (
					<li key={todo.id}>
						<h3>{todo.title}</h3>
						<p>{todo.detail}</p>
						<p>{todo.status}</p>
						<button type="button" onClick={() => deleteTodo(todo.id)}>
							削除
						</button>
						<button
							type="button"
							onClick={() => editTodo(todo.id, { status: "完了" })}
						>
							完了にする
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

import { useState } from "react";

type Todo = {
	id: number;
	title: string;
	status: "未着手" | "進行中" | "完了";
	detail: string;
};

type EditState = {
	id: number | null;
	title: string;
	detail: string;
};

export const TodoApp: React.FC = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [title, setTitle] = useState("");
	const [detail, setDetail] = useState("");
	const [status, setStatus] = useState<"未着手" | "進行中" | "完了">("未着手");
	const [filter, setFilter] = useState<Partial<Todo>>({});
	const [idCounter, setIdCounter] = useState(0);

	const addTodo = (): void => {
		const newTodo: Todo = {
			id: idCounter,
			title,
			status,
			detail,
		};
		setTodos([...todos, newTodo]);
		setTitle("");
		setDetail("");
		setStatus("未着手");
		setIdCounter(idCounter + 1);
	};

	const deleteTodo = (id: number): void => {
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const editTodo = (id: number, updatedTodo: Partial<Todo>): void => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, ...updatedTodo } : todo,
			),
		);
	};

	const filteredTodos = todos.filter((todo) => {
		return (
			(filter.id === undefined ||
				todo.id.toString().includes(filter.id.toString())) &&
			(!filter.title || todo.title.includes(filter.title)) &&
			(!filter.status || todo.status === filter.status)
		);
	});

	// 編集機能のためのステート
	const [editState, setEditState] = useState<EditState>({
		id: null,
		title: "",
		detail: "",
	});

	// 編集の開始
	const startEdit = (todo: Todo): void => {
		setEditState({
			id: todo.id,
			title: todo.title,
			detail: todo.detail,
		});
	};

	// 編集フォームの入力更新
	const handleEditChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	): void => {
		setEditState({ ...editState, [e.target.name]: e.target.value });
	};

	// 編集の確定
	const submitEdit = (): void => {
		if (editState.id !== null) {
			editTodo(editState.id, {
				title: editState.title,
				detail: editState.detail,
			});
			setEditState({ id: null, title: "", detail: "" });
		}
	};

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
					onChange={(e) =>
						setFilter({ ...filter, id: Number.parseInt(e.target.value) })
					}
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

			{/* 編集フォーム：editState.id が null でなければ表示 */}
			{editState.id !== null && (
				<div>
					<h2>編集フォーム</h2>
					<input
						type="text"
						name="title"
						value={editState.title}
						onChange={handleEditChange}
					/>
					<textarea
						name="detail"
						value={editState.detail}
						onChange={handleEditChange}
					/>
					<button type="button" onClick={submitEdit}>
						更新
					</button>
				</div>
			)}

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
						{/* 編集開始ボタン */}
						<button type="button" onClick={() => startEdit(todo)}>
							編集
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

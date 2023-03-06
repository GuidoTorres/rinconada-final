import { Button } from "antd";
import { AiOutlineForm } from "react-icons/ai";

function ButtonAdd({ title, onClick, icon }) {
	return (
		<Button onClick={onClick}>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: 2,
				}}
			>
				{icon}
				{title}
			</div>
		</Button>
	);
}
export default ButtonAdd;

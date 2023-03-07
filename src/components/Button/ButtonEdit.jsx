import { Button, Tooltip } from "antd";
import { AiOutlineEdit } from "react-icons/ai";

function ButtonEdit({ onClick }) {
	return (
		<Tooltip placement="top" title="Editar">
			<Button
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
				icon={<AiOutlineEdit style={{ fontSize: "20px" }} />}
				onClick={onClick}
			/>
		</Tooltip>
	);
}
export default ButtonEdit;

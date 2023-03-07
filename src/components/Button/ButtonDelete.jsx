import { Button, Popconfirm, Tooltip } from "antd";
import { AiOutlineDelete } from "react-icons/ai";

function ButtonDelete({ title, onClick }) {
	return (
		<Tooltip placement="left" title="Eliminar">
			<Popconfirm
				title={title}
				description="¿Estas seguro de eliminar?"
				onConfirm={onClick}
				okText="Si"
				cancelText="No"
				placement="topRight"
			>
				<Button
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
					danger
					icon={
						<AiOutlineDelete
							style={{
								color: "red",
								fontSize: "20px",
							}}
						/>
					}
				/>
			</Popconfirm>
		</Tooltip>
	);
}
export default ButtonDelete;

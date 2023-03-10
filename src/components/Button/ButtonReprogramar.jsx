import { Button } from "antd";

function ButtonReprogramar({ onClick }) {
	return (
		<Button type="primary" onClick={onClick}>
			Reprogramar
		</Button>
	);
}
export default ButtonReprogramar;

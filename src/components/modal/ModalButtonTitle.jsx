import { Button, Col, Modal, Row } from "antd";
import ButtonAdd from "../Button/ButtonAdd";

function ModalButtonTitle({
	className,
	title,
	open,
	width,
	closeModal,
	children,
	buttonLabel,
	onClickButton,
	buttonIcon,
}) {
	return (
		<Modal
			destroyOnClose={true}
			className={className}
			title={
				<Row justify="center">
					<Col span={12}>{title}</Col>
					<Col span={12} align="start">
						<ButtonAdd
							title={buttonLabel}
							onClick={onClickButton}
							icon={buttonIcon}
						/>
					</Col>
				</Row>
			}
			open={open}
			centered
			onCancel={closeModal}
			footer={null}
			width={width}
		>
			{children}
		</Modal>
	);
}
export default ModalButtonTitle;

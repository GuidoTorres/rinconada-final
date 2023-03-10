import { PDFViewer } from "@react-pdf/renderer";
import { Modal } from "antd";
import BoletaPago from "../Boletas/BoletaPago";

function VisualizadorPdf({ open, closeModal, data = {} }) {
	return (
		<Modal
			open={open}
			closeModal={closeModal}
			width={1000}
			centered
			destroyOnClose={true}
			onCancel={closeModal}
			footer={null}
			height="100vh"
			style={{ padding: 0 }}
		>
			<PDFViewer style={{ width: "100%", height: "92vh" }}>
				<BoletaPago data={data} style={{ width: "100%" }} />
			</PDFViewer>
		</Modal>
	);
}
export default VisualizadorPdf;

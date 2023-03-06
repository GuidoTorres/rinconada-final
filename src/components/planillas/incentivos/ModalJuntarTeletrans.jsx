import { sumarTeletrans } from "../../../data/dataTable";
import MainModal from "../../modal/MainModal";
import TablaUnirTeletrans from "../../tabla/TablaUnirTeletrans";

function ModalJuntarTeletrans({ open, closeModal, trabajadores }) {
	const handleValidacion = () => {
		console.log("validacion");
	};

	const handlePagos = (e) => {
		console.log("pagos");
	};

	const columns = sumarTeletrans(handleValidacion, handlePagos);

	return (
		<MainModal
			open={open}
			closeModal={closeModal}
			title="Juntar teletrans"
			width={800}
		>
			<TablaUnirTeletrans columns={columns} table={trabajadores} />
		</MainModal>
	);
}
export default ModalJuntarTeletrans;

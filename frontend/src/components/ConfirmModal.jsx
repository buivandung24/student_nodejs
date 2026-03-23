import Modal from "./Modal";
import Btn from "./Btn";
import { S } from "../constants/styles";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirm Action" onClose={onCancel}>
      <p style={{ marginBottom: 24, color: "#6B7280" }}>{message}</p>
      <div style={S.row(10)}>
        <Btn variant="danger" onClick={onConfirm}>
          Confirm
        </Btn>
        <Btn variant="outline" onClick={onCancel}>
          Cancel
        </Btn>
      </div>
    </Modal>
  );
}

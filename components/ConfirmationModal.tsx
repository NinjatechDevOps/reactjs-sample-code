import { Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export const ConfirmationModal = ({ show, onCancel, onSuccess }: Props) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      className="confirmation-modal"
    >
      <Modal.Body>
        <img src="/images/delete-confirmation.svg" alt="Delete Confirmation" />
        <h5 className="f-w-600">Confirmation</h5>
        <p className="mt-3 mb-3">Are you sure want to delete this ?</p>
        <div className="mb-3">
          <Button variant="outline-primary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSuccess}>
            Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

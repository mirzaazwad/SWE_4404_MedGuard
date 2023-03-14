import '../../index.css'; // import the CSS file for styling
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
function ProfilePicture() {
  const [modalShow, setModalShow] = useState(false);
  return (
    <div className="profile-picture-container">
      <img src={require('../../images/321504286_673183284310305_2418389886188844738_n.jpg')} alt="Profile Picture" />
      <p className="edit-profile-picture" onClick={() => setModalShow(true)}>Edit</p>
      <Modal show={modalShow}
        onHide={() => setModalShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Change Profile Picture
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload new profile picture</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setModalShow(false)}>
                    Close
                  </Button>
                  <Button variant="primary">
                    Save Changes
                  </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
}

export default ProfilePicture;

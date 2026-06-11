import { FunctionComponent } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { COPYRIGHT } from "../shared/config/app.constants";

const ListDesApplications: FunctionComponent = () => {

    const navigate = useNavigate();

    const onClickButtonGrh = () => {
        navigate("/grh");
    }

    const onClickButtonGbc = () => {
        navigate("/gbc");
    }

    const onClickButtonGim = () => {
        navigate("/gim");
    }

    return(
        <Container>
            <Row className="mt-5">
                <h1 className="shadow-sm rounded text-success text-center mt-5 p-3 ">SIGEP</h1>
                <Col className="shadow-lg rounded m-auto p-5 text-center">
                    <div className="p-4">
                        <Button variant="success" size="lg" className="m-1 p-5 w-25" onClick={() => onClickButtonGrh()}>
                            GRH
                        </Button>
                        <Button variant="primary" size="lg" className="m-1 p-5 w-25" onClick={() => onClickButtonGbc()}>
                            GBC
                        </Button>
                        <Button variant="secondary" size="lg" className="m-1 p-5 w-25" onClick={() => onClickButtonGim()}>
                            GIM
                        </Button>
                    </div>
                </Col>
            </Row>
            <h6 className='text-secondary text-center mt-5 p-5'>{COPYRIGHT}</h6>
        </Container>     
    );
}

export default ListDesApplications;
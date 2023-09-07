import { Row, Col, Input, Button, Layout, message, Form } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import {login} from "../Global";
import {ReactComponent as Logo} from "../logo-white.svg"

export default function LogIn () {
var mail = '';
var password = '';

const {Footer} = Layout;
const [visible, setVisible] = useState(false);
const [error, setError] = useState(false)
const navigate = useNavigate();
const [messageApi, contextHolder] = message.useMessage()

function warning  () {
    messageApi.open({
      type: 'warning',
      content: 'Username e/o password errati.',
    });
  };
  
return (
    <>
    
    <div className="container-login">
        <Row  style={{padding: '2rem'}}>
            <Col className={'col-login'} xs={24} md={24} xl={18} >
                    <Logo fill="black" stroke="black"></Logo>
                    <Form>
                        <Input className={'input'}  onChange={(e) => mail = e.target.value} placeholder="Inserisci Email" />
                        <Input.Password className={'input'} onChange={(e) => password = e.target.value} placeholder="Inserisci la Password" colorTextPlaceholder={'rgba(0, 0, 0, 0.25)'} visibilityToggle={{ visible: visible, onVisibleChange: setVisible }}/>
                        <Button style={{marginTop: '10px'}} onClick={async () => {
        
                            if(await login(mail, password)){
                                navigate('/home')
                            }else(warning())
                            
                        }}>Accesso</Button>
                    </Form>
            </Col>
        </Row>
        {contextHolder}
        <Footer className="footer-login"> ©2023 Created CMH </Footer>
    </div>
    </>
)

}
import { Modal,Row, Col, Button } from 'antd';

export default function ModalGraveyard (props) {
//https://maps.google.com/?q=LATITUDE-VALUE,LONGITUDE-VALUE
const path = 'https://maps.google.com/?q='
const cords = props.graveyard.coordinates.split(', ')

    return(
        <>

          <Modal title={props.graveyard.name} open={props.show} onOk={props.setShow} onCancel={props.setShow}>
                <Row>
                    <Col span={5}> 
                        <div><img src={props.graveyard.logo}/></div> 
                    </Col>
                    <Col span={16}>
                         <p><span style={{fontWeight: 'bold'}}>Indirizzo: </span> {props.graveyard.address}</p>
                        <p><span style={{fontWeight: 'bold'}}>Mappa: </span> <Button href={path+cords[0]+`,`+cords[1]} type="link" target='_blank' >Vai alla Mappa</Button></p>
                        <p><span style={{fontWeight: 'bold'}}>Link 1: </span> {props.graveyard.link1}</p>
                        <p><span style={{fontWeight: 'bold'}}>Link 2: </span> {props.graveyard.link2}</p>
                        <p><span style={{fontWeight: 'bold'}}>Link 3: </span> {props.graveyard.link3}</p>
                    </Col>
                </Row>
            </Modal>
        
        </>
    )
}
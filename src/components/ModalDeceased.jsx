import { Modal,Row, Col, Button, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Global, getBlocks } from '../Global';
const { Text } = Typography;
export default function ModalDeceased (props) {
//https://maps.google.com/?q=LATITUDE-VALUE,LONGITUDE-VALUE




    return(
        <>

          <Modal title={`${props.deceased.surname} ${props.deceased.name} `} open={props.show} onOk={props.setShow} onCancel={props.setShow}>
                <Row>
                  
                  
                    <>
                        <Col span={24}>
                         <Text>Data di nascita: {props.deceased.birthdate}</Text>
                        </Col>
                        <Col span={24}>
                            <Text>Data decesso: {props.deceased.deathdate}</Text>
                        </Col>
                        <Col span={24}>
                            <Text>{`Settore: ${props.sector.name} | Blocco: ${props.block.name}`}</Text>
                        </Col>
                    </>
                   
                </Row>
            </Modal>

        </>
    )
}
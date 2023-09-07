import { Col, Row,Button } from "antd";
import { Global } from "../Global";
import CemeteryCard from "./CemeteryCard";
import {FolderAddOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router";
import { useState } from "react";
import ModalGraveyard from "./ModalGraveyard";

export default function CemeteryList () {
    const navigate = useNavigate();
    const [shoModal, setShowModal] = useState(false)
    const [graveyard, setGraveyard] = useState(null)

    async function  infoGraveyard (i) {
       
        const g = Global.cemetery.filter(g_ => g_.id == i);
        
        if(g && g.length > 0){
            setGraveyard(g[0])
            setShowModal(true)
        }
    }

    const setShow = () => {
        setShowModal(false)
    }

    return (
        <>
        <div style={{display: 'flex', justifyContent: 'end'}}>
            <Button type="primary" icon={<FolderAddOutlined />} onClick={() => navigate('/addgraveyard')}>
                Aggiungi
            </Button>
        </div>
            
            <Row>
                
                {Global.cemetery.map(graveyard => 
                        <Col span={24}  xs={24} sm={12} md={8}>
                            <CemeteryCard info={infoGraveyard}  graveyard={graveyard}/>
                        </Col>
                    )}
            </Row>
            {
                graveyard ? 
                    <ModalGraveyard show={shoModal && graveyard} setShow={setShow} graveyard={graveyard}/> 
                : <></>
            }
            
        </>
    )
}
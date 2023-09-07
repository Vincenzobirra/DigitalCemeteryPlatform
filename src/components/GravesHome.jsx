import { Col, Row,Button } from "antd";
import { Global } from "../Global";
import CemeteryCard from "./CemeteryCard";
import {FolderAddOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router";
import { useState } from "react";

export default function GravesHome () {
    const navigate = useNavigate();
    const [graveyard, setGraveyard] = useState(null)

    async function  graves (i) {
        const g = Global.cemetery.filter(g_ => g_.id == i);
        setGraveyard(g[0])
        Global.current_graves_list = Global.graves.filter(g_ => g_.cemetery_id == i);
        console.log(Global.current_graves_list)
        navigate(`/graves/${i}`)
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
                            <CemeteryCard graves={graves} type={''} graveyard={graveyard}/>
                        </Col>
                    )}
            </Row>
           
        </>
    )
}
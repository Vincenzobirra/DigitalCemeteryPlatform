import { useEffect } from "react"
import { Global, getBlocks } from "../Global"
import { useParams } from "react-router"
import { useState } from "react";
import Card from "antd/es/card/Card";
import { useNavigate } from "react-router";
import { Row, Input, List } from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons'; 

export default function BlockList () {
const {id} = useParams();
const [blocks, setBlocks] = useState(null);
const [sector, setSector] = useState(null)
const navigate = useNavigate();
const {Search} = Input;
var setContent = Global.setContent;


    useEffect(() =>{
        setContent('Lista Blocchi del '+sector.name);

        (async () => {const copySectors = [...Global.sectors.filter(s => s.id.toString() === id.toString())]
            setSector(copySectors[0])
            await getBlocks(id);
            setBlocks(Global.blocks)})()
    },[])

    return (
        <>
        <div style={{display: 'flex', justifyContent:'space-between', margin:'5px'}}> 
            <ArrowLeftOutlined className="arrow-back" onClick={() => navigate(-1)}/>
        </div>
        <div className='viewListBlock scrollBar' style={{display: 'none', cursor: 'pointer'}}>
            <List
                itemLayout="horizontal"
                dataSource={blocks ? blocks : []}
                renderItem={(item, index) => (
                <List.Item onClick={() => navigate(`/graves/tomb/${item.id}`)}>
                    <List.Item.Meta
                    title={item.name + " " + item.id}
                    />
                </List.Item>
                )}
            />
        </div>
        
        <Row className="blockSectors" style={{justifyContent: 'space-around', overflowY:'scroll', maxHeight: '800px'}}>
            {
                blocks ?
                    blocks.map(item => 
                        <Card className='cardSector' style={{width:'20%'}} title={item.name + " " + item.id} bordered={false} onClick={() => {
                            navigate(`/graves/tomb/${item.id}`);
                        }}>
                           
                        </Card> )
                :
                <>attendi</>
            }
        </Row>
        </>
    )
}
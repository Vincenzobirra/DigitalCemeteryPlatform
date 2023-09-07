import { Row, Col, Button } from "antd"
import { Global } from "../Global";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function GraveyardInfoc () {
    const data = new Date();
    const path = 'https://maps.google.com/?q=';
    const cords = Global.current_graveyard[0].coordinates.split(', ');
    const navigate = useNavigate();
    var setContent = Global.setContent

    useEffect(() => {
        setContent('Cimitero di '+Global.current_graveyard[0].name)
    }, [])

    return (
        <>
            <div style={{display:'flex', justifyContent: 'center', background: 'white'}}> 
                        <div style={{padding: '30px'}}>
                            <img style={{width: '200px', height: 'auto'}} src={`${Global.current_graveyard[0].logo}?${new Date()}`} className="logo-graveyard"/>
                       </div>
                <Row style={{justifyContent:'center', width: '100%'}}>
                    <Col span={2} style={{padding: '50px',display: 'flex', justifyContent:'center',alignItems:'center'}}> 
                    </Col>
                    <Col span={12} style={{alignItems:'center'}}>
                        <p><span style={{fontWeight: 'bold'}}>Indirizzo: </span> {Global.current_graveyard[0].address}</p>
                        <p><span style={{fontWeight: 'bold'}}>Mappa: </span> <Button href={path+cords[0]+`,`+cords[1]} type="link" target='_blank' >Vai alla Mappa</Button></p>
                        <p><span style={{fontWeight: 'bold'}}>Link 1: </span> {Global.current_graveyard[0].link1}</p>
                        <p><span style={{fontWeight: 'bold'}}>Link 2: </span> {Global.current_graveyard[0].link2}</p>
                        <p><span style={{fontWeight: 'bold'}}>Link 3: </span> {Global.current_graveyard[0].link3}</p>
                        <Button onClick={() => {navigate(`/updategraveyard/${Global.current_graveyard[0].id}`);
                            setContent('Modifica cimitero di: '+Global.current_graveyard[0].name)
                         }}>Modifica</Button>
                    </Col>
                    
                </Row>
                
            </div>
        </>
    )
}
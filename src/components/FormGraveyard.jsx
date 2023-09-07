import { Button, Form, Input, Row, Col, message } from "antd";
import {UploadOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import { useEffect, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router";
import { Global, setCemetery } from "../Global";
import { useForm } from "antd/es/form/Form";

export default function FormGraveyard () {


    const [nameCover, setNameCover] = useState('')
    const [nameLogo, setNameLogo] = useState('')
    const inputCover = useRef()
    const inputLogo = useRef()
    const name_ = useRef()
    const navigate = useNavigate()
    const [data_ , setData] = useState()
    const [file , setFile] = useState()
    const {id} = useParams();
    const [form] = useForm();
    var graveyard;
    var _color = Global.cemetery ? Global.cemetery[0].color : '#000000';

    const [messageApi, contextHolder] = message.useMessage();

    const success = () =>{
        messageApi.open({
            type: 'success',
            content: 'Dati aggiornati correttamente',
            className: 'custom-class',
            style: {
             
              marginTop: '1vh',
            },
          });
    }

    useEffect(() => {
            if(Global.cemetery && id){
               graveyard = Global.current_graveyard
               form.setFieldsValue({
                    'name': graveyard[0].name,
                    'address': graveyard[0].address,
                    'link1': graveyard[0].link1,
                    'link2':graveyard[0].link2,
                    'link3':graveyard[0].link3,
                    'coordinates':graveyard[0].coordinates,
                    'logo':graveyard[0].logo,
                    'cover':graveyard[0].picture,
                    'color':graveyard[0].color,
                })
               setData('');
            }
    },[])


const  onFinish  = async (value) => {
           if(await setCemetery(value ,file)){
            success();
           } 
            setData('');
    }

    return (

        <>
{contextHolder}
            <div className="container-form-cemetery">
            <ArrowLeftOutlined className="arrow-back" onClick={() => navigate(-1)}/>
            <Row className="container-form-cemetery" style={{width: '100%'}}>
                
                    <Col span={22} sm={16} md={18}>
                        <Form form={form} onFinish={onFinish} onFinishFailed={()=>{}}> 

                            <Form.Item label="Nome" name={'name'} rules={[
                                {
                                required: true,
                                message: 'Capo obbligatorio',
                                },
                            ]} >
                                <Input ref={name_}  />
                            </Form.Item>
                            <Form.Item label="Indirizzo" name={'address'} rules={[
                                {
                                required: true,
                                message: 'Capo obbligatorio',
                                },
                            ]}>
                                <Input />
                            </Form.Item>
                             <Form.Item label="Link 1" name={'link1'}>
                                <Input  />
                            </Form.Item>
                            <Form.Item label="Link 2" name={'link2'}>
                                <Input  />
                            </Form.Item>
                            <Form.Item label="Link 3" name={'link3'}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Coordinate" name={'coordinates'}>
                                <Input  />
                            </Form.Item>
                            <Row style={{display:'flex', justifyContent:'space-around'}}>
                                <Col xs={24} sm={6}>
                                    <Form.Item style={{margin: '2px'}} label="Logo" name={'logo'}/>
                                        <Button type="primary" icon={<UploadOutlined />} onClick={() => inputLogo.current.click()}>
                                            Seleziona
                                        </Button>
                                        <p style={{color:'green'}}>{nameLogo}</p>
                                        <input type="file"
                                            ref={inputLogo}
                                            onChange={(e) =>{ 
                                                setNameLogo(e.target.value.split("\\").slice(-1))
                                                setFile(e)
                                            }}
                                            style={{display:'none'}} 
                                        />
                                </Col>
                                <Col xs={24}  sm={6}>
                                <Form.Item style={{margin: '2px'}} label="Copertina"name={'cover'} />
                                    <Button type="primary" icon={<UploadOutlined /> } onClick={() => inputCover.current.click()}>
                                        Seleziona
                                    </Button>
                                    <p style={{color:'green'}}>{nameCover}</p>
                                    <input type="file"
                                        ref={inputCover}
                                        onChange={(e) => setNameCover(e.target.value.split("\\").slice(-1))}
                                        style={{display:'none'}} 
                                    /> 
                                </Col>
                                <Col xs={24}  sm={6}>
                                    <Form.Item style={{margin: '2px'}} label="Colore" name={'color'}/>
                                     <input type="color" id="head" name="head" defaultValue={_color} onChange={(e) => form.setFieldsValue({'color' : e.target.value})}/>
                                </Col>
                            </Row>
                            
                        <Col span={24}>
                            <div style={{display: 'flex', justifyContent: 'end', marginTop: '5px'}} >
                                <Button htmlType="submit">Aggiorna cimitero</Button>
                                
                                <Button style={{marginLeft: '10px'}} onClick={() => navigate(-1)}>Annulla</Button>
                            </div>
                        </Col>
                    </Form>
                </Col>
            </Row>
            </div>
          
        
        </>

    )
}
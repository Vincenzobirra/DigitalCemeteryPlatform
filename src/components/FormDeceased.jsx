import { Form, Input, Button, Col, Row, Select, DatePicker, Switch, message, Upload, Image, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router';
import {ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react';
import getDeceased, { getBlocks, getTombs,Global } from '../Global';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs'
import { setDeceased, getGraves } from '../Global';

export default function FormDeceased () {
    const navigate = useNavigate()
    const [tombs, setTombs] = useState(null)
    const [blocks, setBlocks] = useState([])
    const [entombments, setEntombments] = useState()
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
    const {id} = useParams();
    const [form] = useForm();
    const [optionsSectors, setOptionsSectors] = useState();
    const [pictureData, setPictureData] = useState();
    const [messageApi, contextHolder] = message.useMessage();
    const [display, setDisplay] = useState('');
    const [loader, showLoader] = useState(false); 
    var setContent = Global.setContent


    useEffect(() => {
        setContent('Nuovo defunto');

    }, [])

    useEffect( () =>  {
       
        (async () =>{
            showLoader(true)
            form.setFieldsValue({
                'enabled': true,
            })
            
            setEntomb()
            await getDeceased(id)
            await selectTombs(id ? Global.current_deceased[0].sector_id : 1, id ? Global.current_deceased[0].block_id : 1)
            await getBlocks(id ? parseInt(Global.current_deceased[0].sector_id) : 1);
            
            const tmp = [];
            if(Global){
                (Global.sectors ?? []).map((item, index) => 
                    tmp.push({
                        'value': item.id,
                        'label': item.name
                    })
                );
                
                setOptionsSectors(tmp);
                if(id){selectBlocks(Global.current_deceased[0].sector_id)}
            }
            await getDeceased(id)

            if(id){
                setContent('Modifica defunto: '+Global.current_deceased[0].name+' '+Global.current_deceased[0].surname);
                form.setFieldsValue({
                'id' : Global.current_deceased[0].id,
                'name': Global.current_deceased[0].name,
                'surname': Global.current_deceased[0].surname,
                'enabled': Global.current_deceased[0].enabled == 0 ? false : true,
                'fiscalCode': Global.current_deceased[0].fiscal_code,
                'sector': Global.current_deceased[0].sector_id,
                'block': Global.current_deceased[0].block_id,
                'epitaph': Global.current_deceased[0].epitaph,
                'tomb': Global.current_deceased[0].tomb_id,
                'entombment': Global.current_deceased[0].entombment_id,
                'birthdate': dayjs(Global.current_deceased[0].birthdate),
                'deathdate': dayjs(Global.current_deceased[0].deathdate),
                'picture': Global.current_deceased[0].picture,
                })
            }
            showLoader(false)
            })()       
        },[id])

        useEffect(()=>{
            form.resetFields()
            setBlocks()
            setTombs()
        },[id])
    
        async function selectTombs(sector, block, s) {
            if(id || s == true) {
                await getTombs(sector, block)
              } else{ return }
            
            const temp = []
            if(Global){
                (Global.tombs ?? []).map((item, index) => 
                    temp.push({
                        'value': item.id,
                        'label': item.reference
                    })
                );
            }
            setTombs(temp)
    }

    function setEntomb() {
        const t =[]
        Global.entombments.map(m => {
            t.push({
                'value': m.id,
                'label': m.name
            })
        });
        setEntombments(t)
    }

   async function selectBlocks(id) {
        await getBlocks(id)
        const temp = []

        if(Global && id){
            (Global.blocks ?? []).map((item, index) => 
                temp.push({
                    'value': item.id,
                    'label': item.name
                })
            );
        
            setBlocks(temp)
        }
    }

    const success = (mess, type) => {
        const mes = {
            type: type,
            content: mess,
          }
        messageApi.open(mes);
        if(type == 'success' || type == 'success'){
            form.resetFields()
            setDisplay('none')
            navigate('/addDeceased/')
        }
      };
    

    const  onFinish = async (values) =>{
        await setDeceased(values, pictureData).then(results => {
             getGraves()
                success(results[0], results[1]);
                return})
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return(
       <div className='scrollBar'>
            {
                loader ?
                    <div className='loaderContainer'><Spin className='loader' size="large" /></div>
                :
                    <></>
            }    
            {contextHolder}
          <ArrowLeftOutlined className="arrow-back" onClick={() => navigate(-1)}/>
          <Form className='scrollBar' form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Row style={{justifyContent: 'space-evenly'}}>
            
                <Col xs={24} md={11}>
                
                    <Form.Item style={{display: 'none'}} name={'id'}></Form.Item>

                    <Form.Item label="Nome" name={'name'}  rules={[
                        {
                        required: true,
                        message: 'Capo obbligatorio',
                        },
                    ]}>
                        <Input placeholder="Scivi nome" />
                    </Form.Item>

                    <Form.Item label="Cognome" name={'surname'} rules={[
                        {
                        required: true,
                        message: 'Capo obbligatorio',
                        },
                    ]}>
                        <Input placeholder="Inserisci cognome"  />
                    </Form.Item>

                    <Form.Item label="Data nascita" name={'birthdate'}  rules={[
                        {
                        required: true,
                        message: 'Capo obbligatorio',
                        },
                    ]}>
                        <DatePicker  format={dateFormatList}  />
                    </Form.Item>

                    <Form.Item label="Data Decesso" name={'deathdate'} rules={[
                        {
                        required: true,
                        message: 'Capo obbligatorio',
                        },
                    ]} >
                        <DatePicker  format={dateFormatList} />
                    </Form.Item>

                    <Form.Item label="Codice Fiscale" name={'fiscalCode'}>
                        <Input placeholder="inserisci codice fiscale"  />
                    </Form.Item>

                    <Form.Item
                        name="picture"
                        label="Upload"
                        onChange={e => {
                            setPictureData(e);
                            setDisplay('none')
                        }}
                        extra=""
                        >
                        <Upload name="logo" action="/upload.do" listType="picture" >
                            <Button icon={<UploadOutlined />}>Aggiungi foto</Button>
                        </Upload>
                    </Form.Item>
                    <Image src={id && Global.current_deceased[0] ? Global.current_deceased[0].picture : ''} style={{display: display}} width={300}></Image>
                </Col>

                <Col xs={24}  md={11}>
                    <Form.Item label="Settore" name={'sector'} rules={[
                        {
                        required: true,
                        message: 'Capo obbligatorio',
                        },
                    ]}>
                        <Select placeholder="Seleziona Settore" onChange={(e) => {selectBlocks(e); form.setFieldsValue({'block' : null, 'tomb' : null})}} options={optionsSectors}>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label="Blocchi" name={'block'} rules={[
                        {
                        required: true,
                        message: 'Capo obbligatorio',
                        },
                    ]} >
                        <Select placeholder="Seleziona Blocco" options={blocks} onChange={(e) => { selectTombs(form.getFieldValue('sector'), e, true); form.setFieldsValue({'tomb' : null})}}>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label="Tomba" name={'tomb'} rules={[
                        {
                        required: true,
                        message: 'Capo obbligatorio',
                        },
                    ]}>
                        <Select placeholder="Seleziona la tomba"  options={tombs}>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Tipo di sepoltura" name={'entombment'} rules={[
                        {
                        required: true,
                        message: 'Capo obbligatorio',
                        },
                    ]}>
                        <Select placeholder="Seleziona sepoltura" options={entombments}  >
                        </Select>
                    </Form.Item>

                    <Form.Item name={'epitaph'} label="Epitaffio">
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name="enabled" label="Online" valuePropName="checked">
                        <Switch/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" >
                        Salva
                    </Button>
                </Col> 
            </Row>
        
            </Form>
         
       </div>
    )
}
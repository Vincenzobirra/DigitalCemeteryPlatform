import { EditOutlined, AppstoreOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Card, Skeleton, Switch } from 'antd';  
import { useNavigate } from 'react-router';

const {Meta} = Card;
export default function CemeteryCard (props) {
    const navigate = useNavigate()
    
    return (
        <>
    
        {
            
            props.type == undefined ?
            <Card
                style={{ width: '100%', marginTop: 16, background: '' }}
                actions={[
                <EditOutlined key="edit" onClick={() => {
                    navigate(`/updategraveyard/${props.graveyard.id}`)
                }} />,

                
                <InfoCircleOutlined key='info' onClick={() => {
                    props.info(props.graveyard.id)

                }}/>,
                ]}
                >
                <Skeleton loading={false} avatar active>
                <Meta
                    avatar={<Avatar src={props.graveyard.logo} />}
                    title={props.graveyard.name}
                    description={props.graveyard.address}
                />
                </Skeleton>
            </Card>

            :

            <Card
                style={{ width: '100%', marginTop: 16, background: '' }}
                actions={[
                <EditOutlined key="edit" onClick={() => {
                    navigate(`/updategraveyard/${props.graveyard.id}`)
                }} />,

                
                <AppstoreOutlined key='graves' onClick={() => {
                    props.graves(props.graveyard.id)
                }}/>,
                ]}
                >
                <Skeleton loading={false} avatar active>
                <Meta
                    avatar={<Avatar src={props.graveyard.logo} />}
                    title={props.graveyard.name}
                    description={props.graveyard.address}
                />
                </Skeleton>
            </Card>
            }
        
        </>
    )
}
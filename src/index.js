import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LogIn from './components/LogIn';
import Home from './components/Home';
import PrivateRoutesAdmin from './components/PrivateRoutesAdmin';
import FormGraveyard from './components/FormGraveyard';
import CemeteryList from './components/CemeteryList';
import GravesHome from './components/GravesHome'
import GravesList from './components/GravesList';
import BlockList from './components/BlocksList';
import ListByBlock from './components/ListByBlock';
import FormDeceased from './components/FormDeceased'; 
import GraveyardInfoc from './components/GraveyardInfoc';
import Welcome from './components/Welcome';
import SectorsList from './components/SectorsList';
import EditSectors from './components/EditSector';
import BlocksAll from './components/BlocksAll'
import TombsList from './components/TombsList';
import EditBlock from './components/EditBlock';
import EditTomb from './components/EditTomb';
import TombsListView from './components/TombsListView';
import ListByTomb from './components/ListByTomb';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <BrowserRouter basename='/' >
   
    <Routes>
      <Route path='/'                         element={<LogIn></LogIn>} />
      <Route path='/home'                     element={ <PrivateRoutesAdmin><Home><Welcome></Welcome></Home></PrivateRoutesAdmin> } />
      <Route path='/cemeterylist'             element={ <PrivateRoutesAdmin><Home><CemeteryList></CemeteryList></Home></PrivateRoutesAdmin> } />
      <Route path='/gravelard/'               element={ <PrivateRoutesAdmin><Home><GraveyardInfoc></GraveyardInfoc></Home></PrivateRoutesAdmin> } />
      <Route path='/addgraveyard'             element={ <PrivateRoutesAdmin><Home><FormGraveyard></FormGraveyard></Home></PrivateRoutesAdmin> } />
      <Route path='/updategraveyard/:id'      element={ <PrivateRoutesAdmin><Home><FormGraveyard></FormGraveyard></Home></PrivateRoutesAdmin> } />
      <Route path='/graves/'                  element={ <PrivateRoutesAdmin><Home><GravesHome></GravesHome></Home></PrivateRoutesAdmin>} />
      <Route path='/graves/:id'               element={ <PrivateRoutesAdmin><Home><GravesList/></Home></PrivateRoutesAdmin>} />
      <Route path='/graves/sector/:id'        element={<PrivateRoutesAdmin><Home><BlockList></BlockList></Home></PrivateRoutesAdmin> }/>
      <Route path='/graves/block/:id'         element={<PrivateRoutesAdmin><Home><ListByBlock></ListByBlock></Home></PrivateRoutesAdmin> }/>
      <Route path='/addDeceased/'             element={<PrivateRoutesAdmin><Home><FormDeceased></FormDeceased></Home></PrivateRoutesAdmin> }/>
      <Route path='/edit/:id'                 element={<PrivateRoutesAdmin><Home><FormDeceased></FormDeceased></Home></PrivateRoutesAdmin> }/>
      <Route path='/sectors/'                 element={<PrivateRoutesAdmin><Home><SectorsList></SectorsList></Home></PrivateRoutesAdmin> }/>
      <Route path='/edit/sector/:id'          element={<PrivateRoutesAdmin><Home><EditSectors></EditSectors></Home></PrivateRoutesAdmin> }/>
      <Route path='/create/sector/'           element={<PrivateRoutesAdmin><Home><EditSectors></EditSectors></Home></PrivateRoutesAdmin> }/>
      <Route path='/blocks/'                  element={<PrivateRoutesAdmin><Home><BlocksAll></BlocksAll></Home></PrivateRoutesAdmin> }/>
      <Route path='/tombs/'                   element={<PrivateRoutesAdmin><Home><TombsList></TombsList></Home></PrivateRoutesAdmin> }/>
      <Route path='/edit/block/:id'           element={<PrivateRoutesAdmin><Home><EditBlock></EditBlock></Home></PrivateRoutesAdmin> }/>
      <Route path='/create/block/'            element={<PrivateRoutesAdmin><Home><EditBlock></EditBlock></Home></PrivateRoutesAdmin> }/>
      <Route path='/edit/tomb/:id'            element={<PrivateRoutesAdmin><Home><EditTomb></EditTomb></Home></PrivateRoutesAdmin> }/>
      <Route path='/create/tomb/'             element={<PrivateRoutesAdmin><Home><EditTomb></EditTomb></Home></PrivateRoutesAdmin> }/>
      <Route path='/graves/tomb/:idBlock'     element={<PrivateRoutesAdmin><Home><TombsListView/></Home></PrivateRoutesAdmin> }/>
      <Route path='/tombs/block/:idBlock'     element={<PrivateRoutesAdmin><Home><TombsList></TombsList></Home></PrivateRoutesAdmin> }/>
      <Route path='/listbytomb/:idTomb'       element={<PrivateRoutesAdmin><Home><ListByTomb/></Home></PrivateRoutesAdmin> }/>
    </Routes>
    
  </BrowserRouter>
  

);


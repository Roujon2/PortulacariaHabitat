import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';
import { PolygonContextProvider } from '../../../contexts/PolygonContext';
import { AlertProvider } from '../../../contexts/AlertContext';

import './home.css';

// Resizable panels
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

import InteractiveMap from '../../Organisms/InteractiveMap/InteractiveMap';

// Menus
import HelpMenu from '../../Organisms/HelpMenu/HelpMenu';
import ProfileMenu from '../../Organisms/ProfileMenu/ProfileMenu';
import PolygonsMenu from '../../Organisms/PolygonsMenu/PolygonsMenu';
import SSEComponent from '../../Atoms/SSEComponent/sseComponent';

// Server offline box
import ServerOfflineBox from '../../Atoms/ServerOfflineBox/ServerOfflineBox';


interface HomeProps {
    // Selected menu item
    selectedMenu: string;
}

const Home: React.FC<HomeProps> = ({selectedMenu}) => {
    const { user } = useContext(AuthContext) as AuthContextProps;
    
    // State var to keep track of if the server is online
    const [serverOnline, setServerOnline] = useState(true);

    // UseEffect keeping track of the server status
    useEffect(() => {
        if (!serverOnline) {
            console.log('Server offline');
        }
    }, [serverOnline]);

    if (!user) {
        return <p>Loading from Home...</p>;
    }

    return (
        <AlertProvider>
            <PolygonContextProvider>
                <div className='home-page'>
                    <PanelGroup direction='horizontal'>
                        <Panel defaultSize={60} minSize={30}>
                            <InteractiveMap />
                        </Panel>
                        <PanelResizeHandle className='resize-handle__home'/>
                        <Panel defaultSize={40} minSize={20} maxSize={70}>
                            {selectedMenu === 'help' && <HelpMenu />}
                            {selectedMenu === 'profile' && <ProfileMenu user={user}/>}
                            {selectedMenu === 'polygons' && <PolygonsMenu />}
                        </Panel>
                    </PanelGroup>
                    <SSEComponent setServerOnline={setServerOnline}/>

                    {!serverOnline && <ServerOfflineBox />}
                </div>
            </PolygonContextProvider>
        </AlertProvider>
    );
};

export default Home;
import React, { useContext } from 'react';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';

import './home.css';

// Resizable panels
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

import InteractiveMap from '../../Organisms/InteractiveMap/InteractiveMap';

// Menus
import HelpMenu from '../../Organisms/HelpMenu/HelpMenu';
import ProfileMenu from '../../Organisms/ProfileMenu/ProfileMenu';
import PolygonsMenu from '../../Organisms/PolygonsMenu/PolygonsMenu';


interface HomeProps {
    // Selected menu item
    selectedMenu: string;
}

const Home: React.FC<HomeProps> = ({selectedMenu}) => {
    const { user } = useContext(AuthContext) as AuthContextProps;


    console.log(user);

    if (!user) {
        return <p>Loading from Home...</p>;
    }

    return (
        <div className='home-page'>
            <PanelGroup direction='horizontal'>
                <Panel defaultSize={80} minSize={30}>
                    <InteractiveMap />
                </Panel>
                <PanelResizeHandle className='resize-handle'/>
                <Panel defaultSize={20} minSize={10} maxSize={50}>
                    {selectedMenu === 'help' && <HelpMenu />}
                    {selectedMenu === 'profile' && <ProfileMenu />}
                    {selectedMenu === 'polygons' && <PolygonsMenu />}
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default Home;
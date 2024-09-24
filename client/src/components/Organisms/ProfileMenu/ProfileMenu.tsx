import React, { useEffect, useState } from "react";

import './profileMenu.css'
import { User } from './../../../types/user';
import polygonApi from "../../../api/polygonApi";
import { RiLogoutBoxFill } from "react-icons/ri";


interface ProfileMenuProps {
    user: User;
}

// Profile menu component
const ProfileMenu: React.FC<ProfileMenuProps> = ({ user }) => {
    const [polygonCount, setPolygonCount] = useState<{ count: number } | null>(null);

    useEffect(() => {
        polygonApi.getPolygonCount().then(count => {
            setPolygonCount(count);
        });
    }, []);

    return (
        <div className='profile-menu'>
            <h1>Profile</h1>
            <div className="profile-menu__content">
                <div className="profile-menu__picture">
                    <img src={user.picture} alt='Profile' />
                </div>
                <div className="profile-menu__info">
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <p>Polygons: {polygonCount !== null ? polygonCount.count : 'Loading...'}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileMenu;